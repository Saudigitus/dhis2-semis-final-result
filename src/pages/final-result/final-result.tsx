import { useRecoilValue } from 'recoil';
import { Table, useSchoolCalendarKey } from "dhis2-semis-components";
import { InfoPage } from 'dhis2-semis-components'
import { D2I18n, ProgramConfig } from 'dhis2-semis-types'
import React, { useEffect, useState } from "react";
import { TableDataRefetch, Modules } from "dhis2-semis-types"
import useGetSelectedKeys from '../../hooks/config/useGetSelectedKeys';
import { useFinalResultConst } from '../../hooks/common/finalResultConst';
import EnrollmentActionsButtons from "../../components/enrollmentButtons/EnrollmentActionsButtons";
import { useCheckFilters, useHeader, useTableData, useUrlParams, useViewPortWidth } from "dhis2-semis-functions";

export default function FinalResult({ i18n, baseUrl }: { i18n: D2I18n, baseUrl: string }) {
  const { viewPortWidth } = useViewPortWidth();
  const { urlParameters } = useUrlParams();
  const [selected, setSelected] = useState([])
  const { dataStoreData, program: programData } = useGetSelectedKeys()
  const [updatedData, updateData] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pageSize: 50, totalPages: 0, totalElements: 0 })
  const { academicYear, grade, class: section, schoolName, school, sectionType } = urlParameters;
  const { getData, tableData, loading } = useTableData({ module: Modules.Final_Result });
  const { columns } = useHeader({ dataStoreData, programConfigData: programData as unknown as ProgramConfig, programStage: dataStoreData?.['final-result']?.programStage as unknown as string });
  const [filetrState, setFilterState] = useState<{ dataElements: any[], attributes: any[] }>({ attributes: [], dataElements: [] });
  const refetch = useRecoilValue(TableDataRefetch);
  const { finalResultConst } = useFinalResultConst({ updateData, data: tableData.data })
  const schoolCalendar = useSchoolCalendarKey()
  const { getFilters } = useCheckFilters({ filters: (dataStoreData?.filters?.dataElements ?? []) as unknown as any })

  const getInfoPageContent = () => {
    if (sectionType === 'staff') {
      return {
        title: i18n.t("SEMIS-Staff-Re-enrollment"),
        sectionTitle: `${i18n.t("Follow the instructions to proceed")}:`,
        instructions: [
          i18n.t("Select the Organization unit you want to view data"),
          i18n.t("Use global filters(Type of Staff, Employment Type and Academic Year)")
        ]
      }
    }
    return {
      title: i18n.t("SEMIS-Final-Result"),
      sectionTitle: `${i18n.t("Follow the instructions to proceed")}:`,
      instructions: [
        i18n.t("Select the Organization unit you want to view data"),
        i18n.t("Use global filters(Class, Grade and Academic Year)")
      ]
    }
  }

  const infoPageContent = getInfoPageContent()
  const tableTitle = sectionType === 'staff' ? i18n.t('Staff Re-enrollment') : i18n.t('Final Results')
  const inactiveRowMessage = sectionType === 'staff' ? i18n.t('Terminated') : i18n.t('Dropout')

  useEffect(() => {
    setSelected([])
    if (school && academicYear)
      void getData({
        page: pagination.page,
        pageSize: pagination.pageSize,
        program: programData?.id as string,
        orgUnit: school!,
        baseProgramStage: dataStoreData?.registration?.programStage as string,
        attributeFilters: filetrState.attributes,
        dataElementFilters: [
          ...(academicYear ? [`${schoolCalendar?.academicYear}:in:${academicYear}`] : []),
          ...getFilters() as unknown as any
        ],
        otherProgramStage: dataStoreData?.['final-result']?.programStage,
        order: dataStoreData.defaults.defaultOrder
      })
  }, [sectionType, filetrState, refetch, pagination.page, pagination.pageSize, academicYear, grade, section, school])

  useEffect(() => {
    setPagination((prev) => ({ ...prev, totalPages: tableData.pagination.totalPages, totalElements: tableData.pagination.totalElements }))
    if (tableData.data.length > 0) finalResultConst()
  }, [tableData])

  return (
    <div style={{ height: "85vh" }}>
      {
        !(Boolean(schoolName) && Boolean(school)) ?
          <InfoPage
            title={infoPageContent.title}
            sections={[
              {
                sectionTitle: infoPageContent.sectionTitle,
                instructions: infoPageContent.instructions
              }
            ]}
          />
          :
          <>
            <Table
              programConfig={programData!}
              title={tableTitle}
              viewPortWidth={viewPortWidth}
              columns={columns}
              tableData={updatedData}
              inactiveRowMessage={inactiveRowMessage}
              enableInactiveRowSelection={true}
              filterState={filetrState}
              loading={loading}
              rightElements={
                <EnrollmentActionsButtons
                  i18n={i18n}
                  selected={selected}
                  selectedDataStoreKey={dataStoreData}
                  programData={programData as unknown as ProgramConfig}
                  baseUrl={baseUrl}
                />
              }
              setFilterState={setFilterState}
              selectable={true}
              selected={selected}
              setSelected={setSelected}
              pagination={pagination}
              setPagination={setPagination}
              paginate={!loading}
            />
          </>
      }
    </div>
  )
}
