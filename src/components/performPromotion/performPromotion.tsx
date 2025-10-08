import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Form } from "react-final-form";
import { NoticeBox, Button, IconAddCircle24 } from "@dhis2/ui";
import useGetSelectedKeys from "../../hooks/config/useGetSelectedKeys";
import { RulesEngine, useUrlParams } from "dhis2-semis-functions";
import { usePromoteStudents } from "../../hooks/promote/usePromoteStudents";
import { WithBorder, CustomForm, ModalComponent, WithPadding } from "dhis2-semis-components";
import { Tooltip } from "@mui/material";
import { getContextualLabels } from "../../utils/common/getContextualLabels";

export default function PerformPromotion({ selected, setStats, openStats, formData = [] }: { openStats: (args: boolean) => void, setStats: any, selected: any[], formData: any[] }) {
    const { urlParameters } = useUrlParams()
    const { schoolName, school, sectionType } = urlParameters
    const { program: programData, dataStoreData } = useGetSelectedKeys()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState<{ [key: string]: any }>({ orgUnit: school });
    const { promote } = usePromoteStudents({ selected, setOpen: openStats, setStats, setOpenPerform: setOpen, setLoading })
    const labels = getContextualLabels(sectionType as string)

    const promotableStudents = selected.filter(estudante => {
        const dvs = estudante.frEvent?.dataValues ?? [];
        return dvs.length === 0 || dvs.some((dv: any) =>
            dv.dataElement === dataStoreData["final-result"]?.status &&
            dv.value?.toLowerCase() !== "promoted"
        );
    });


    const { runRulesEngine, updatedVariables } = RulesEngine({
        program: programData?.id!,
        type: "programStage",
        values: values,
        variables: formData
    })

    useEffect(() => {
        setValues({
            ...values,
            orgUnit: school
        });
    }, [school])


    useEffect(() => {
        runRulesEngine()
    }, [values])


    const handleChange = (e: { field: any; value: string; name: string }) => {
        const { name, value } = e;
        setValues(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const onClick = async (values: any) => await promote(values)

    return (
        <>
            <Tooltip
                title={promotableStudents?.length > 0 ? labels.noResultMessage : ""}
            >
                <Button disabled={promotableStudents?.length > 0 || selected.length == 0} onClick={() => {
                    setOpen(true);
                }} icon={<IconAddCircle24 />}
                >
                    <span>{labels.promoteButtonLabel}</span>
                </Button >
            </Tooltip>
            {
                open && <ModalComponent
                    children={<WithPadding>
                        <NoticeBox title={`WARNING! ${selected.length} rows will be affected`} warning>
                            No one will be able to access this program. Add some Organisation Units to the access list.
                        </NoticeBox>
                        <WithPadding />
                        <WithBorder type="all" >
                            <WithPadding>
                                <CustomForm
                                    Form={Form}
                                    loading={loading}
                                    initialValues={{ registeringSchool: schoolName, enrollment_date: format(new Date(), 'yyyy-MM-dd') }}
                                    formFields={[
                                        {
                                            storyBook: false,
                                            name: labels.formName,
                                            description: labels.formDescription,
                                            fields: updatedVariables || [],
                                        }
                                    ]}
                                    storyBook={false}
                                    withButtons={true}
                                    onFormSubtmit={(values) => onClick(values)}
                                    onCancel={() => setOpen(false)}
                                    setFormValues={setValues}
                                    onInputChange={handleChange}
                                />
                            </WithPadding>
                        </WithBorder>
                    </WithPadding>}
                    open={open}
                    handleClose={() => setOpen(false)}
                    title={labels.promoteModalTitle}
                />
            }
        </>
    );
}