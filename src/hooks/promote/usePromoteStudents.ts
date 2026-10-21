import { format } from "date-fns";
import useGetSelectedKeys from "../config/useGetSelectedKeys";
import { useGetEvents, useUploadEvents, useUrlParams } from "dhis2-semis-functions"
import { useGetUsedProgramStages, useSchoolCalendarKey } from "dhis2-semis-components";
import { newUid, refusedEnrollments } from "../../utils/promote/promotionReport";

export function usePromoteStudents({ selected, setOpen, setStats, setOpenPerform, setLoading }: { setLoading: (args: boolean) => void, setOpenPerform: any, setStats: (args: any) => void, selected: any[], setOpen: (args: boolean) => void }) {
    const { getEvents } = useGetEvents()
    const { urlParameters } = useUrlParams();
    const { school, sectionType } = urlParameters;
    const { uploadValues } = useUploadEvents()
    const schoolCalendar = useSchoolCalendarKey()
    const { dataStoreData, program: programData } = useGetSelectedKeys()
    const programStagesToUse = useGetUsedProgramStages({ sectionType: sectionType as any })

    async function promote(values: any) {
        setLoading(true)
        let enrollments: any[] = []
        const learners: any[] = []
        let registrationEvent: any = []
        let date = format(new Date(), 'yyyy-MM-dd')
        const socioEconomicPStage = dataStoreData["socio-economics"]?.programStage

        const orgUnit = sectionType === 'staff' ? values.registeringSchool : school;

        const { registeringSchool, enrollment_date, ...registrationValues } = values
        for (const key in registrationValues) {
            registrationEvent.push({
                dataElement: key,
                value: registrationValues[key]
            })
        }

        const returnEventStructure = (stage: string, datavalues: any[]) => {
            return { occurredAt: date, notes: [], status: "ACTIVE", program: programData?.id, programStage: stage, orgUnit, scheduledAt: date, dataValues: datavalues }
        }

        for (const tei of selected) {
            const checkAlreadyPromoted = sectionType === 'staff'
                ? []
                : await getEvents({ program: tei.programId, fields: "*", trackedEntities: tei.trackedEntity, programStage: dataStoreData.registration.programStage, filter: [`${schoolCalendar?.academicYear}:in:${values?.[schoolCalendar?.academicYear]}`] })

            if (checkAlreadyPromoted?.length === 0) {
                let events = []
                let socioEconomicDataValues: any = []

                const socioEconomicEvent = await getEvents({ program: tei.programId, fields: "*", trackedEntities: tei.trackedEntity, programStage: socioEconomicPStage })
                const event = socioEconomicEvent?.find((x: any) => x.enrollment === tei.enrollmentId)

                if (event) {
                    event?.dataValues.forEach((dataValue: any) => {
                        socioEconomicDataValues.push({
                            dataElement: dataValue?.dataElement,
                            value: dataValue?.value
                        })
                    })

                    events.push(returnEventStructure(socioEconomicPStage, socioEconomicDataValues))
                }

                events.push(returnEventStructure(dataStoreData.registration.programStage, registrationEvent))

                programStagesToUse.forEach(programStage => {
                    events.push(returnEventStructure(programStage, []))
                })

                const enrollment = newUid()
                learners.push(tei)
                enrollments.push(
                    {
                        trackedEntity: tei.trackedEntity,
                        trackedEntityType: dataStoreData.trackedEntityType,
                        orgUnit,
                        attributes: tei.attributes || [],
                        enrollments: [
                            {
                                enrollment,
                                occurredAt: date,
                                enrolledAt: values.enrollment_date,
                                program: programData?.id,
                                orgUnit,
                                status: "COMPLETED",
                                events: events
                            }
                        ]
                    })
            } else setStats((prev: any) => ({ ...prev, conflicts: [...prev.conflicts, tei] }))
        }

        // Count only what the server saved: a refused enrollment is listed with the server's reason (SEMIS-225).
        let refused: Record<string, string> = {}
        if (enrollments.length) {
            const sent = enrollments.map(x => ({ trackedEntity: x.trackedEntity, enrollment: x.enrollments[0].enrollment }))
            try {
                refused = refusedEnrollments(await uploadValues({ trackedEntities: enrollments }, 'COMMIT', 'CREATE_AND_UPDATE'), sent)
            } catch (error: any) {
                refused = refusedEnrollments(error?.details, sent)
                if (!Object.keys(refused).length) sent.forEach(x => { refused[x.trackedEntity] = error?.message ?? 'Not saved' })
            }
        }

        setStats((prev: any) => ({
            ...prev,
            posted: enrollments.length - Object.keys(refused).length,
            refused: learners.filter(tei => refused[tei.trackedEntity]).map(tei => ({ ...tei, refusalReason: refused[tei.trackedEntity] }))
        }))
        setOpenPerform(false)
        setLoading(false)
        setOpen(true)
    }

    return { promote }
}