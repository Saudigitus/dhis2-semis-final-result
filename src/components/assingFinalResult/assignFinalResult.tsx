import { useGetDataElements, useUrlParams, useUploadEvents, useGetEvents } from "dhis2-semis-functions";
import { useState } from "react";
import { NoticeBox, Button, IconAddCircle24 } from "@dhis2/ui";
import { useDataStoreKey, WithBorder, ModalComponent, CustomForm, WithPadding } from "dhis2-semis-components";
import { Form } from "react-final-form";
import { TableDataRefetch } from "dhis2-semis-types";
import { useSetRecoilState } from "recoil";

export default function AsssignFinalResult({ selected }: { selected: any[] }) {
    const { urlParameters } = useUrlParams()
    const { sectionType, school } = urlParameters()
    const { "final-result": fr, trackedEntityType } = useDataStoreKey({ sectionType: sectionType as unknown as "student" | "staff" })
    const { dataElements } = useGetDataElements({ programStageId: fr?.programStage as unknown as string, type: "programStage" })
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { uploadValues } = useUploadEvents()
    const { getEvents } = useGetEvents()
    const setRefetch = useSetRecoilState(TableDataRefetch);

    async function formSubmit(values: any) {
        setLoading(true)
        let teis = []
        let frStatus = Object.keys(values)[0]

        for (const tei of selected) {
            const frEvents = await getEvents({ program: tei.programId, fields: "*", trackedEntity: tei.trackedEntity, programStage: fr?.programStage })
            const enrollmentEvent = frEvents.find((x: any) => x.enrollment === tei.enrollmentId)

            teis.push({
                orgUnit: school,
                trackedEntityType: trackedEntityType,
                trackedEntity: enrollmentEvent?.trackedEntity,
                enrollments: [
                    {
                        enrollment: enrollmentEvent?.enrollment,
                        status: values[frStatus] === "Dropout" ? "CANCELLED" : "COMPLETED",
                        orgUnit: enrollmentEvent?.orgUnit,
                        program: enrollmentEvent?.program,
                        enrolledAt: enrollmentEvent?.occurredAt,
                        occurredAt: enrollmentEvent?.occurredAt,
                        trackedEntityType: trackedEntityType,
                        events: [
                            {
                                ...enrollmentEvent,
                                dataValues: [
                                    {
                                        dataElement: frStatus,
                                        value: values[frStatus]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })
        }
        await uploadValues({ trackedEntities: teis }, 'COMMIT', 'CREATE_AND_UPDATE')
            .then(() => { setLoading(false); setRefetch(prev => (!prev)); setOpen(false) })
            .catch(() => { setLoading(false); setOpen(false) })
    }


    return (
        <>
            <Button disabled={selected?.length == 0} onClick={() => {
                setOpen(true);
            }} icon={<IconAddCircle24 />}
            >
                <span>Assing final result</span>
            </Button >

            {
                open && <ModalComponent
                    children={<WithPadding>
                        <NoticeBox title={`WARNING! ${selected.length} rows will be affected`} warning>
                            No one will be able to access this program. Add some Organisation Units to the access list.
                        </NoticeBox>
                        <WithBorder type="all" >
                            <WithPadding>
                                <CustomForm
                                    Form={Form}
                                    loading={loading}
                                    formFields={[
                                        {
                                            storyBook: false,
                                            name: "Final Result",
                                            description: "Student final result",
                                            fields: dataElements
                                        }
                                    ]}
                                    storyBook={false}
                                    withButtons={true}
                                    onFormSubtmit={(e) => formSubmit(e)}
                                    onCancel={() => setOpen(false)}
                                />
                            </WithPadding>
                        </WithBorder>
                    </WithPadding>}
                    open={open}
                    handleClose={() => setOpen(false)}
                    title="Assign Final Result"
                />
            }
        </>
    );
}