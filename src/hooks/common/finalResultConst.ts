import { useDataStoreKey, useProgramsKeys } from "dhis2-semis-components";
import { useGetSectionTypeLabel } from "dhis2-semis-functions";
import '../../assets/style/colors.css'
import { statusComponent } from "../../components/status/status";

export const useFinalResultConst = ({ updateData, data }: { data: any[], updateData: (args: any) => void }) => {
    const { sectionName } = useGetSectionTypeLabel();
    const dataStoreData = useDataStoreKey({ sectionType: sectionName });
    const programsValues = useProgramsKeys();
    const programData = programsValues[0];
    const stage = dataStoreData?.['final-result']?.programStage
    const status = dataStoreData?.['final-result']?.status

    function finalResultConst() {
        let copy = [...data]
        for (let index = 0; index < copy.length; index++) {
            if (copy[index][status!]) {
                const option = programData?.programStages
                    ?.find(x => x.id === stage)?.programStageDataElements
                    ?.find(x => x.dataElement.id === status)
                    ?.dataElement.optionSet.options
                    ?.find(x => x.value === copy[index][status!])?.label

                copy[index][status!] = statusComponent({ status: option! })
            }
        }

        updateData(copy)
    }

    return {
        finalResultConst
    }
}
