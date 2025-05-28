import { format } from "date-fns";
import useGetSelectedKeys from "../config/useGetSelectedKeys";
import { useGetEvents, useUploadEvents, useUrlParams } from "dhis2-semis-functions"

export function usePromoteStudents({ selected, setOpen, setStats, setOpenPerform, setLoading }: { setLoading: (args: boolean) => void, setOpenPerform: any, setStats: (args: any) => void, selected: any[], setOpen: (args: boolean) => void }) {
    const { getEvents } = useGetEvents()
    const { urlParameters } = useUrlParams();
    const { school: orgUnit } = urlParameters();
    const { uploadValues } = useUploadEvents()
    const { dataStoreData, program: programData } = useGetSelectedKeys()

    async function promote(values: any) {
        setLoading(true)
        let registration: any = []
        const scPstage = dataStoreData["socio-economics"].programStage
        let enrollments: any[] = []
        let date = format(new Date(), 'yyyy-MM-dd')

        Object.keys(dataStoreData.registration).forEach((ds: any) => {
            if (values?.[(dataStoreData?.registration as unknown as any)?.[ds]]) {
                registration.push({
                    dataElement: (dataStoreData?.registration as unknown as any)?.[ds],
                    value: values?.[(dataStoreData?.registration as unknown as any)?.[ds]]
                })
            }
        })

        const getEventStructure = (stage: string, datavalues: any[]) => {
            return { occurredAt: date, notes: [], status: "ACTIVE", program: programData?.id, programStage: stage, orgUnit, scheduledAt: date, dataValues: datavalues }
        }

        for (const tei of selected) {
            const checkAlreadyPromoted = await getEvents({ program: tei.programId, fields: "*", trackedEntity: tei.trackedEntity, programStage: dataStoreData.registration.programStage, filter: [`${dataStoreData.registration.academicYear}:in:${values?.[dataStoreData.registration.academicYear]}`] })

            if (checkAlreadyPromoted?.length === 0) {
                let events = []
                let socioEconomicDataValues: any = []

                const scData = await getEvents({ program: tei.programId, fields: "*", trackedEntity: tei.trackedEntity, programStage: scPstage })
                const event = scData?.find((x: any) => x.enrollment === tei.enrollmentId)

                if (event) {
                    event?.dataValues.forEach((dataValue: any) => {
                        socioEconomicDataValues.push({
                            dataElement: dataValue?.dataElement,
                            value: dataValue?.value
                        })
                    })

                    events.push(getEventStructure(scPstage, socioEconomicDataValues))
                }

                events.push(getEventStructure(dataStoreData.registration.programStage, registration))
                events.push(getEventStructure(dataStoreData["final-result"]?.programStage as unknown as string, []))

                dataStoreData.performance?.programStages.forEach(performanceProgramStage => {
                    events.push(getEventStructure(performanceProgramStage.programStage, []))
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

        if (enrollments.length > 0) await uploadValues({ trackedEntities: enrollments }, 'COMMIT', 'CREATE_AND_UPDATE')

        setStats((prev: any) => ({ ...prev, posted: enrollments.length }))
        setOpenPerform(false)
        setLoading(false)
        setOpen(true)
    }

    return { promote }
}