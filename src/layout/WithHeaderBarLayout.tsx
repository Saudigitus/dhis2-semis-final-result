import { Outlet } from "react-router-dom"
import { HeaderBarLayout, SemisHeader } from "dhis2-semis-components"

const WithHeaderBarLayout = () => {

    return (
        <HeaderBarLayout
            header={
                <SemisHeader
                    headerItems={{
                        academicYears: {
                            options: [
                                {
                                    label: '2024',
                                    value: '2024'
                                },
                                {
                                    label: '2023',
                                    value: '2023'
                                },
                                {
                                    label: '2022',
                                    value: '2022'
                                }
                            ]
                        },
                        classes: {
                            options: [
                                {
                                    label: 'A',
                                    value: 'A'
                                },
                                {
                                    label: 'B',
                                    value: 'B'
                                },
                                {
                                    label: 'C',
                                    value: 'C'
                                },
                                {
                                    label: 'D',
                                    value: 'D'
                                },
                                {
                                    label: 'E',
                                    value: 'E'
                                },
                                {
                                    label: 'F',
                                    value: 'F'
                                }
                            ]
                        },
                        grades: {
                            options: [
                                {
                                    label: 'Grade 1',
                                    value: 'Grade 1'
                                },
                                {
                                    label: 'Grade 2',
                                    value: 'Grade 2'
                                },
                                {
                                    label: 'Grade 3',
                                    value: 'Grade 3'
                                },
                                {
                                    label: 'Grade 4',
                                    value: 'Grade 4'
                                },
                                {
                                    label: 'Grade 5',
                                    value: 'Grade 5'
                                },
                                {
                                    label: 'Grade 6',
                                    value: 'Grade 6'
                                },
                                {
                                    label: 'Grade 7',
                                    value: 'Grade 7'
                                }
                            ]
                        },
                        orgunits: {
                            options: []
                        }
                    }}
                />
            }
        >
            <Outlet />
        </HeaderBarLayout>
    )
}

export default WithHeaderBarLayout