import { useState } from "react";
import { Form } from "react-final-form";
import { useSetRecoilState } from "recoil";
import { TableDataRefetch } from "dhis2-semis-types";
import { NoticeBox, Button, IconAddCircle24 } from "@dhis2/ui";
import useGetSelectedKeys from "../../hooks/config/useGetSelectedKeys";
import { WithBorder, ModalComponent, CustomForm, WithPadding } from "dhis2-semis-components";
import { useGetDataElements, useUploadEvents, useGetEvents, useUrlParams } from "dhis2-semis-functions";

export default function AsssignFinalResult({ selected }: { selected: any[] }) {
    const { dataStoreData } = useGetSelectedKeys()
    const { "final-result": finalResult, trackedEntityType } = dataStoreData
    const { dataElements } = useGetDataElements({ programStageId: finalResult?.programStage as unknown as string, type: "programStage" })
    const { urlParameters } = useUrlParams()
    const { school } = urlParameters()
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
            const frEvents = await getEvents({
                program: tei.programId, fields: "*",
                trackedEntity: tei.trackedEntity,
                programStage: finalResult?.programStage
            })
            const enrollmentEvent = frEvents.find((x: any) => x.enrollment === tei.enrollmentId)

            teis.push({
                orgUnit: school,
                trackedEntityType: trackedEntityType,
                trackedEntity: enrollmentEvent?.trackedEntity,
                enrollments: [
                    {
                        enrollment: tei.enrollmentId,
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
            .then(() => { setLoading(false); setRefetch((prev: any) => (!prev)); setOpen(false) })
            .catch(() => { setLoading(false); setOpen(false) })
    }


    return (
        <>
            <Button disabled={selected?.length == 0} onClick={() => {
                setOpen(true);
            }} icon={<IconAddCircle24 />}
            >
                <span>Assign final result</span>
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
                                    onFormSubtmit={(e: any) => formSubmit(e)}
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