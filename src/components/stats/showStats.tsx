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

    return (
        <ModalComponent
            open={open}
            handleClose={() => setOpen(!open)}
            dataTest="final-result-show-stats-modal"
            children={
                <div>
                    <Tag positive icon={<IconCheckmarkCircle16 />}> {labels.summaryPreviewTag} </Tag>

                    <WithPadding />
                    <label className={styles.title}>Summary</label>
                    <WithPadding />

                    <ButtonStrip>
                        <SummaryCard dataTest="final-result-promoted-students-card" color="success" label={labels.successLabel} value={stats?.posted ?? 0} />
                        <SummaryCard dataTest="final-result-no-promoted-students-card" color="error" label={labels.failureLabel} value={stats?.conflicts?.length ?? 0} />
                    </ButtonStrip>

                    <WithPadding />
                    {stats?.conflicts?.length > 0 ?
                        <>
                            <ButtonStrip>
                                <Button small icon={<InfoOutlined />} onClick={() => setShowDetails(!showDetails)}>More details</Button>
                            </ButtonStrip>
                            <br />
                            <span style={{ color: "red" }}>{labels.conflictMessage}</span>
                        </>
                        : null}
                    <WithPadding />

                    <Collapse data-test='fr-stats-table' in={showDetails} style={{ marginBottom: "20px" }} >
                        <WithPadding>
                            <Table
                                programConfig={programData!}
                                viewPortWidth={viewPortWidth}
                                columns={columns}
                                tableData={stats.conflicts}
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