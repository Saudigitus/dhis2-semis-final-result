import { format } from "date-fns";
import useGetSelectedKeys from "../config/useGetSelectedKeys";
import { useGetEvents, useUploadEvents, useUrlParams } from "dhis2-semis-functions"
import { useGetUsedProgramStages, useSchoolCalendarKey } from "dhis2-semis-components";

export function usePromoteStudents({ selected, setOpen, setStats, setOpenPerform, setLoading }: { setLoading: (args: boolean) => void, setOpenPerform: any, setStats: (args: any) => void, selected: any[], setOpen: (args: boolean) => void }) {
    const { getEvents } = useGetEvents()
    const { urlParameters } = useUrlParams();
    const { school: orgUnit, sectionType } = urlParameters;
    const { uploadValues } = useUploadEvents()
    const schoolCalendar = useSchoolCalendarKey()
    const { dataStoreData, program: programData } = useGetSelectedKeys()
    const programStagesToUse = useGetUsedProgramStages({ sectionType: sectionType as any })

    async function promote(values: any) {
        setLoading(true)
        let enrollments: any[] = []
        let registrationEvent: any = []
        let date = format(new Date(), 'yyyy-MM-dd')
        const socioEconomicPStage = dataStoreData["socio-economics"]?.programStage

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
            const checkAlreadyPromoted = await getEvents({ program: tei.programId, fields: "*", trackedEntity: tei.trackedEntity, programStage: dataStoreData.registration.programStage, filter: [`${schoolCalendar?.academicYear}:in:${values?.[schoolCalendar?.academicYear]}`] })

            if (checkAlreadyPromoted?.length === 0) {
                let events = []
                let socioEconomicDataValues: any = []

                const socioEconomicEvent = await getEvents({ program: tei.programId, fields: "*", trackedEntity: tei.trackedEntity, programStage: socioEconomicPStage })
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
                    if (programStage !== socioEconomicPStage && programStage !== dataStoreData["final-result"]?.programStage)
                        events.push(returnEventStructure(programStage, []))
                })

                enrollments.push(
                    {
                        enrollments: [
                            {
                                occurredAt: date,
                                enrolledAt: values.enrollment_date,
                                program: programData?.id,
                                orgUnit,
                                status: "COMPLETED",
                                events: events
                            }
                        ],
                        orgUnit,
                        trackedEntityType: dataStoreData.trackedEntityType,
                        trackedEntity: tei.trackedEntity
                    })
            } else setStats((prev: any) => ({ ...prev, conflicts: [...prev.conflicts, tei] }))
        }

        if (enrollments.length) await uploadValues({ trackedEntities: enrollments }, 'COMMIT', 'CREATE_AND_UPDATE')

        setStats((prev: any) => ({ ...prev, posted: enrollments.length }))
        setOpenPerform(false)
        setLoading(false)
        setOpen(true)
    }

    return { promote }
}