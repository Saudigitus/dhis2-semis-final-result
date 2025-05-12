import React from 'react'
import style from "../Layout.module.css"
import { SemisHeader, useDataStoreKey, useProgramsKeys } from 'dhis2-semis-components';
import { LayoutProps } from '../../types/layout/LayoutProps';
import { Outlet } from 'react-router-dom';
import { useGetSectionTypeLabel } from 'dhis2-semis-functions';

export default function FullLayout() {
    const { sectionName } = useGetSectionTypeLabel();
    const dataStoreData = useDataStoreKey({ sectionType: sectionName });

    const programsValues = useProgramsKeys();
    const programData = programsValues[0];

    const registration = programData?.programStages?.find((stage) => stage.id === dataStoreData.registration?.programStage)

    const academicYear = registration?.programStageDataElements?.find((dataElement) => dataElement.dataElement.id === dataStoreData.registration.academicYear)?.dataElement.optionSet.options
    const grade = registration?.programStageDataElements?.find((dataElement) => dataElement.dataElement.id === dataStoreData.registration.grade)?.dataElement.optionSet.options
    const section = registration?.programStageDataElements?.find((dataElement) => dataElement.dataElement.id === dataStoreData.registration.section)?.dataElement.optionSet.options

    return (
        <div className={style.LayoutContainer}>
            <div className={style.FullLayoutContainer}>
                <SemisHeader headerItems={{
                    academicYears: {
                        options: academicYear
                    },
                    classes: {
                        options: section
                    },
                    grades: {
                        options: grade
                    },
                    orgunits: {
                        options: []
                    }
                }}
                />
                <main className={style.MainContentContainer}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

