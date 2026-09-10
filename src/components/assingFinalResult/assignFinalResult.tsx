import { useState } from "react";
import { Form } from "react-final-form";
import { useSetRecoilState } from "recoil";
import { TableDataRefetch } from "dhis2-semis-types";
import { NoticeBox, Button, IconAddCircle24 } from "@dhis2/ui";
import useGetSelectedKeys from "../../hooks/config/useGetSelectedKeys";
import { WithBorder, ModalComponent, CustomForm, WithPadding } from "dhis2-semis-components";
import { useGetDataElements, useUploadEvents, useGetEvents, useUrlParams } from "dhis2-semis-functions";
import { format } from "date-fns";
import { getContextualLabels } from "../../utils/common/getContextualLabels";
import { dataStoreRecord } from "../../types/dataStore/DataStoreConfig";

export default function AsssignFinalResult({ selected, i18n }: { selected: any[], i18n: any }) {
    const { dataStoreData } = useGetSelectedKeys()
    const { "final-result": finalResult, trackedEntityType } = dataStoreData as unknown as dataStoreRecord || {}
    const { dataElements } = useGetDataElements({
        programStageId: finalResult?.programStage || '',
        type: "programStage"
    })
    const { urlParameters } = useUrlParams()
    const { school, sectionType } = urlParameters
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { uploadValues } = useUploadEvents()
    const { getEvents } = useGetEvents()
    const setRefetch = useSetRecoilState(TableDataRefetch);
    const labels = getContextualLabels(sectionType as string)

    async function formSubmit(values: any) {
        setLoading(true)
        let teis = []
        let frStatus = Object.keys(values)[0]

        for (const tei of selected) {
            const frEvents = await getEvents({
                program: tei?.programId, fields: "*",
                trackedEntities: tei?.trackedEntity,
                programStage: finalResult?.programStage
            })
            const selectedEnrollmentFrEvent = frEvents.find((x: any) => x.enrollment === tei?.enrollmentId)

            if (selectedEnrollmentFrEvent) {
                teis.push({
                    orgUnit: school,
                    trackedEntityType: trackedEntityType,
                    trackedEntity: selectedEnrollmentFrEvent?.trackedEntity,
                    enrollments: [
                        {
                            trackedEntity: tei?.trackedEntity,
                            enrollment: tei?.enrollmentId,
                            status: finalResult?.dropoutStatusValues?.includes(values[frStatus]) ? "CANCELLED" : "COMPLETED",
                            orgUnit: selectedEnrollmentFrEvent?.orgUnit,
                            program: selectedEnrollmentFrEvent?.program,
                            enrolledAt: selectedEnrollmentFrEvent?.occurredAt,
                            occurredAt: selectedEnrollmentFrEvent?.occurredAt,
                            trackedEntityType: trackedEntityType,
                            events: [
                                {
                                    ...selectedEnrollmentFrEvent,
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
            else {
                teis.push({
                    orgUnit: school,
                    trackedEntity: tei?.trackedEntity,
                    trackedEntityType: trackedEntityType,
                    enrollments: [
                        {
                            orgUnit: school,
                            program: tei?.programId,
                            trackedEntity: tei?.trackedEntity,
                            enrollment: tei?.enrollmentId,
                            trackedEntityType: trackedEntityType,
                            enrolledAt: format(new Date(), "yyyy-MM-dd"),
                            occurredAt: format(new Date(), "yyyy-MM-dd"),
                            status: finalResult?.dropoutStatusValues?.includes(values[frStatus]) ? "CANCELLED" : "COMPLETED",
                            events: [
                                {
                                    orgUnit: school,
                                    status: "COMPLETED",
                                    program: tei?.programId,
                                    programStage: finalResult?.programStage,
                                    occurredAt: format(new Date(), "yyyy-MM-dd"),
                                    scheduledAt: format(new Date(), "yyyy-MM-dd"),
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
                <span>{labels.assignButtonLabel}</span>
            </Button >

            {
                open && <ModalComponent
                    children={<WithPadding>
                        <NoticeBox title={`${i18n.t("WARNING")}! ${selected.length} ${i18n.t("rows will be affected")}`} warning>
                            {i18n.t("No one will be able to access this program. Add some Organisation Units to the access list")}.
                        </NoticeBox>
                        <WithBorder type="all" >
                            <WithPadding>
                                <CustomForm
                                    Form={Form}
                                    loading={loading}
                                    formFields={[
                                        {
                                            storyBook: false,
                                            name: labels.assignFormName,
                                            description: labels.assignFormDescription,
                                            fields: dataElements || []
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
                    title={labels.assignModalTitle}
                />
            }
        </>
    );
}