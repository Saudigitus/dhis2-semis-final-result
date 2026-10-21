import { Button, ButtonStrip, IconCheckmarkCircle16, Tag } from "@dhis2/ui";
import { ModalComponent, SummaryCard, Table, WithPadding } from "dhis2-semis-components";
import styles from './showStats.module.css'
import { Collapse } from "@mui/material";
import { useState } from "react";
import { useHeader, useUrlParams, useViewPortWidth } from "dhis2-semis-functions";
import { ProgramConfig, TableDataRefetch } from "dhis2-semis-types";
import { useSetRecoilState } from "recoil";
import useGetSelectedKeys from "../../hooks/config/useGetSelectedKeys";
import { InfoOutlined } from "@mui/icons-material";
import { getContextualLabels } from "../../utils/common/getContextualLabels";

export default function ShowStats({ stats, open, setOpen }: { setOpen: (args: boolean) => void, open: boolean, stats: any }) {
    const [showDetails, setShowDetails] = useState(false)
    const { dataStoreData, program: programData } = useGetSelectedKeys();
    const { viewPortWidth } = useViewPortWidth();
    const { urlParameters } = useUrlParams();
    const { sectionType } = urlParameters;
    const { columns } = useHeader({ dataStoreData, programConfigData: programData as unknown as ProgramConfig, programStage: dataStoreData?.registration?.programStage as unknown as string });
    const setRefetch = useSetRecoilState(TableDataRefetch);
    const labels = getContextualLabels(sectionType as string)
    // Learners refused by the server are listed with its reason (SEMIS-225).
    const refused = stats?.refused ?? []
    const notPromoted = [...(stats?.conflicts ?? []), ...refused]
    const reasonColumn = { id: 'refusalReason', displayName: labels.refusalReasonLabel, header: labels.refusalReasonLabel, name: 'refusalReason', labelName: labels.refusalReasonLabel, valueType: 'TEXT', visible: true, required: false, disabled: false, pattern: '', searchable: false, error: false, content: '', key: '' }

    return (
        <ModalComponent
            open={open}
            handleClose={() => setOpen(!open)}
            children={
                <div>
                    <Tag positive icon={<IconCheckmarkCircle16 />}> {labels.summaryPreviewTag} </Tag>

                    <WithPadding />
                    <label className={styles.title}>Summary</label>
                    <WithPadding />

                    <ButtonStrip>
                        <SummaryCard color="success" label={labels.successLabel} value={stats?.posted ?? 0} />
                        <SummaryCard color="error" label={labels.failureLabel} value={notPromoted.length} />
                    </ButtonStrip>

                    <WithPadding />
                    {notPromoted.length > 0 ?
                        <>
                            <ButtonStrip>
                                <Button small icon={<InfoOutlined />} onClick={() => setShowDetails(!showDetails)}>More details</Button>
                            </ButtonStrip>
                            <br />
                            {stats?.conflicts?.length > 0 && <span style={{ color: "red", display: "block" }}>{labels.conflictMessage}</span>}
                            {refused.length > 0 && <span style={{ color: "red", display: "block" }}>{labels.refusedMessage}</span>}
                        </>
                        : null}
                    <WithPadding />

                    <Collapse in={showDetails && notPromoted.length > 0} style={{ marginBottom: "20px" }} >
                        <WithPadding>
                            <Table
                                programConfig={programData!}
                                viewPortWidth={viewPortWidth}
                                columns={refused.length > 0 ? [...(columns ?? []), reasonColumn] as any : columns}
                                tableData={notPromoted}
                                showHeaderFilters={false}
                                showWorkingListsContainer={false}
                                paginate={false}
                            />
                        </WithPadding>
                    </Collapse>

                    <ButtonStrip end>
                        <Button primary={true} onClick={() => { setOpen(false); setRefetch(prev => (!prev)) }} >
                            Close
                        </Button>
                    </ButtonStrip>
                </ div>
            }
            title={labels.summaryTitle}
        />
    )
}