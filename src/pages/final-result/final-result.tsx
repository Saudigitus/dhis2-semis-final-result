import { useRecoilValue } from 'recoil';
import { ProgramConfig } from 'dhis2-semis-types'
import React, { useEffect, useState } from "react";
import { TableDataRefetch, Modules } from "dhis2-semis-types"
import { InfoPage, useDataStoreKey } from 'dhis2-semis-components'
import { Table, useProgramsKeys } from "dhis2-semis-components";
import EnrollmentActionsButtons from "../../components/enrollmentButtons/EnrollmentActionsButtons";
import { useGetSectionTypeLabel, useHeader, useTableData, useUrlParams, useViewPortWidth } from "dhis2-semis-functions";
import { useFinalResultConst } from '../../hooks/common/finalResultConst';

export default function FinalResult() {
  const { sectionName } = useGetSectionTypeLabel();
  const dataStoreData = useDataStoreKey({ sectionType: sectionName });
  const programsValues = useProgramsKeys();
  const programData = programsValues[0];
  const { viewPortWidth } = useViewPortWidth();
  const { urlParameters } = useUrlParams();
  const [selected, setSelected] = useState([])
  const [updatedData, updateData] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 0 })
  const { academicYear, grade, class: section, schoolName, school, sectionType } = urlParameters();
  const { getData, tableData, loading } = useTableData({ module: Modules.Final_Result });
  const { columns } = useHeader({ dataStoreData, programConfigData: programData as unknown as ProgramConfig, tableColumns: [], programStage: dataStoreData?.['final-result']?.programStage as unknown as string });
  const [filetrState, setFilterState] = useState<{ dataElements: any[], attributes: any[] }>({ attributes: [], dataElements: [] });
  const refetch = useRecoilValue(TableDataRefetch);
  const { finalResultConst } = useFinalResultConst({ updateData, data:tableData.data })

  // console.log(programData?.programStages.find(x => x.id === dataStoreData?.['final-result']?.programStage)?.programStageDataElements?.find(x=>x.dataElement.id===))
  useEffect(() => {
    setSelected([])
    void getData({
      page: pagination.page,
      pageSize: pagination.pageSize,
      program: programData.id as string,
      orgUnit: school!,
      baseProgramStage: dataStoreData?.registration?.programStage as string,
      attributeFilters: filetrState.attributes,
      dataElementFilters: [
        ...(academicYear ? [`${dataStoreData.registration.academicYear}:in:${academicYear}`] : []),
        ...(grade ? [`${dataStoreData.registration.grade}:in:${grade}`] : []),
        ...(section ? [`${dataStoreData.registration.section}:in:${section}`] : []),
      ],
      otherProgramStage: dataStoreData?.['final-result']?.programStage
    })
  }, [sectionType, filetrState, refetch, pagination.page, pagination.pageSize, academicYear, grade, section, school])

  useEffect(() => {
    setPagination((prev) => ({ ...prev, totalPages: tableData.pagination.totalPages }))
    if (tableData.data.length > 0) finalResultConst()
  }, [tableData])

  return (
    <div style={{ height: "85vh" }}>
      {
        !(Boolean(schoolName) && Boolean(school)) ?
          <InfoPage
            title="SEMIS-Final-Result"
            sections={[
              {
                sectionTitle: "Follow the instructions to proceed:",
                instructions: [
                  "Select the Organization unit you want to view data",
                  "Use global filters(Class, Grade and Academic Year)"
                ]
              }
            ]}
          />
          :
          <>
            <Table
              programConfig={programData}
              title="Final Results"
              viewPortWidth={viewPortWidth}
              columns={columns}
              tableData={updatedData}
              filterState={filetrState}
              loading={loading}
              rightElements={<EnrollmentActionsButtons selected={selected} selectedDataStoreKey={dataStoreData} programData={programData as unknown as ProgramConfig} />}
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
