import { useGetSectionTypeLabel } from "dhis2-semis-functions";
import { useDataStoreKey, useProgramsKeys } from "dhis2-semis-components";

export default function useGetSelectedKeys() {
    const { sectionName } = useGetSectionTypeLabel();
    const dataStoreArray = useDataStoreKey({ sectionType: sectionName });
    const programsValues = useProgramsKeys();

    const dataStoreData = Array.isArray(dataStoreArray)
        ? dataStoreArray.find((config: any) => config.key === sectionName)
        : dataStoreArray;

    return {
        dataStoreData,
        program: programsValues?.find((program) => program?.id == dataStoreData?.program)
    }
}