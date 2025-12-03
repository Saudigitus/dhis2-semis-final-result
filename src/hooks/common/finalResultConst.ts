import { statusComponent } from "../../components/status/status";
import useGetSelectedKeys from "../config/useGetSelectedKeys";

export const useFinalResultConst = ({ updateData, data }: { data: any[], updateData: (args: any) => void }) => {
    const { dataStoreData, program: programData } = useGetSelectedKeys()
    const stage = dataStoreData?.['final-result']?.programStage
    const status = dataStoreData?.['final-result']?.status

    function finalResultConst() {
        let copy = [...data]
        for (let index = 0; index < copy.length; index++) {
            if (copy[index][status!]) {
                const option: any = programData?.programStages
                    ?.find(x => x.id === stage)?.programStageDataElements
                    ?.find(x => x.dataElement.id === status)
                    ?.dataElement.optionSet.options
                    ?.find(x => x.value === copy[index][status!])


                copy[index][status!] = option ? statusComponent({ option: option! }) : undefined
            }
        }

        updateData(copy)
    }

    return {
        finalResultConst
    }
}
