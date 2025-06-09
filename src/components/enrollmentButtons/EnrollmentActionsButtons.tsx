import React, { useState, useEffect } from 'react'
import { ButtonStrip, Center, CircularLoader, IconUserGroup16 } from "@dhis2/ui";
import styles from './enrollmentActionsButtons.module.css'
import { useBuildForm, useGetSectionTypeLabel, useUrlParams } from 'dhis2-semis-functions';
import { Form } from "react-final-form";
import { Modules, ProgramConfig, selectedDataStoreKey } from 'dhis2-semis-types'
import { DataExporter, DataImporter, CustomDropdown as DropdownButton } from 'dhis2-semis-components';
import AsssignFinalResult from '../assingFinalResult/assignFinalResult';
import PerformPromotion from '../performPromotion/performPromotion';
import ShowStats from '../stats/showStats';
import { useConfig } from '@dhis2/app-runtime';
import { Tooltip } from '@mui/material';
import useGetSelectedKeys from '../../hooks/config/useGetSelectedKeys';
import { staticForm } from "../../constants/searchEnrollmentForm";

function EnrollmentActionsButtons({ programData, selectedDataStoreKey, selected }: { selected: any, programData: ProgramConfig, selectedDataStoreKey: selectedDataStoreKey }) {
    const { urlParameters } = useUrlParams();
    const { baseUrl } = useConfig()
    const { school: orgUnit, class: section, grade, academicYear } = urlParameters();
    const { sectionName } = useGetSectionTypeLabel();
    const { dataStoreData } = useGetSelectedKeys()
    const { formData } = useBuildForm({ dataStoreData, programData, module: Modules.Enrollment });
    const [enrollmentDetails = []] = formData
    const [stats, setStats] = useState<{ posted: number, conflicts: any[] }>({ posted: 0, conflicts: [] })
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (formData.length > 0) {
            setLoading(false);
        }
    }, [formData])


    if (loading) {
        return (
            <Center>
                <CircularLoader small />
            </Center>
        )
    }

    const enrollmentOptions: any = [
        {
            label: <DataImporter
                baseURL={baseUrl}
                label={'Bulk Final Result'}
                module='final-result'
                onError={(e: any) => { console.log(e) }}
                programConfig={programData}
                sectionType={sectionName}
                selectedSectionDataStore={selectedDataStoreKey}
                updating={false}
                title={"Bulk Final Result"}
            />,
            divider: true,
            disabled: false,
        },
        {
            label: <DataExporter
                Form={Form}
                baseURL={baseUrl}
                eventFilters={[
                    ...(academicYear ? [`${selectedDataStoreKey.registration.academicYear}:in:${academicYear}`] : []),
                    ...(grade ? [`${selectedDataStoreKey.registration.grade}:in:${grade}`] : []),
                    ...(section ? [`${selectedDataStoreKey.registration.section}:in:${section}`] : []),
                ]}
                fileName='teste'
                label='Export Final Result'
                module='final-result'
                onError={(e: any) => console.log(e)}
                programConfig={programData}
                sectionType={sectionName}
                selectedSectionDataStore={selectedDataStoreKey}
                empty={false}
                stagesToExport={[selectedDataStoreKey?.['final-result']?.programStage as unknown as string]}
            />,
            divider: false,
            disabled: false,
        }
    ];

    return (
        <div className={styles.container}>
            <ShowStats open={open} setOpen={setOpen} stats={stats} />
            <ButtonStrip className={styles.work_buttons}>
                <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""}>
                    <AsssignFinalResult selected={selected} />
                </Tooltip>
                <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""} >
                    <PerformPromotion formData={[staticForm().registeringSchool, ...enrollmentDetails, staticForm().enrollmentDate]} openStats={setOpen} setStats={setStats} selected={selected} />
                </Tooltip>

                <DropdownButton
                    name={<span className={styles.work_buttons_text}>Bulk Final Result</span> as unknown as string}
                    disabled={!!(orgUnit == undefined || section == undefined || grade == undefined || academicYear == undefined)}
                    icon={<IconUserGroup16 />}
                    options={enrollmentOptions}
                />
            </ButtonStrip>
        </div>
    )
}

export default EnrollmentActionsButtons
