import { Outlet } from "react-router-dom"
import { HeaderBarLayout, SemisHeader } from "dhis2-semis-components"
import useGetSelectedKeys from "../hooks/config/useGetSelectedKeys"
import { useConfig } from "@dhis2/app-runtime"

const WithHeaderBarLayout = () => {
    const { program, dataStoreData } = useGetSelectedKeys()
    const { baseUrl } = useConfig()

    return (
        <HeaderBarLayout
            header={
                <SemisHeader
                    program={program as unknown as any}
                    dataStoreValues={dataStoreData}
                    baseUrl={baseUrl}
                />
            }
        >
            <Outlet />
        </HeaderBarLayout>
    )
}

export default WithHeaderBarLayout