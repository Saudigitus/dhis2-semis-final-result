import { RowActionsType } from "dhis2-semis-components/dist/declarations/types/table/TableRowActionsProps";
import { Attribute } from "../../../types/generated";
import { CustomAttributeProps, VariablesTypes } from "../../../types/variables/AttributeColumns";
import { IconCheckmarkCircle24, IconDelete24, IconEdit24 } from "@dhis2/ui";

export const rowsData = [
    { fistid1: 'First Name', fistid2: 'Second Name', fistid3: 'Therd Name', fistid4: 'Fourth Name' },
    { fistid1: 'First Name', fistid2: 'Second Name', fistid3: 'Therd Name', fistid4: 'Fourth Name' },
    { fistid1: 'First Name', fistid2: 'Second Name', fistid3: 'Therd Name', fistid4: 'Fourth Name' },
    { fistid1: 'First Name', fistid2: 'Second Name', fistid3: 'Therd Name', fistid4: 'Fourth Name' }
]

export const headerColumns = [
    {
        id: "fistid1",
        displayName: "First Name",
        header: "First Name",
        required: false,
        name: "firstName",
        valueType: "TEXT" as unknown as CustomAttributeProps["valueType"],
        disabled: false,
        visible: true,
        options: {
            optionSet: {
                id: "optionSetId",
                options: [
                    {
                        value: "option1",
                        label: "Option 1"
                    }
                ]
            }
        },
        labelName: "First Name",
        type: VariablesTypes.Attribute,
        trackedEntity: "trackedEntity",
        placeholder: "First Name",
        unique: false,
        searchable: true,
    },
    {
        id: "fistid2",
        displayName: "Second Name",
        header: "First Name",
        required: false,
        name: "firstName",
        valueType: "TEXT" as unknown as CustomAttributeProps["valueType"],
        disabled: false,
        visible: true,
        options: {
            optionSet: {
                id: "optionSetId",
                options: [
                    {
                        value: "option1",
                        label: "Option 1"
                    }
                ]
            }
        },
        labelName: "First Name",
        type: VariablesTypes.Attribute,
        trackedEntity: "trackedEntity",
        placeholder: "First Name",
        unique: false,
        searchable: true,
    },
    {
        id: "fistid3",
        displayName: "Therd Name",
        header: "First Name",
        required: false,
        name: "firstName",
        valueType: "TEXT" as unknown as CustomAttributeProps["valueType"],
        disabled: false,
        visible: true,
        options: {
            optionSet: {
                id: "optionSetId",
                options: [
                    {
                        value: "option1",
                        label: "Option 1"
                    }
                ]
            }
        },
        labelName: "First Name",
        type: VariablesTypes.Attribute,
        trackedEntity: "trackedEntity",
        placeholder: "First Name",
        unique: false,
        searchable: true,
    },
    {
        id: "fistid4",
        displayName: "Fourth Name",
        header: "First Name",
        required: false,
        name: "firstName",
        valueType: "TEXT" as unknown as CustomAttributeProps["valueType"],
        disabled: false,
        visible: true,
        options: {
            optionSet: {
                id: "optionSetId",
                options: [
                    {
                        value: "option1",
                        label: "Option 1"
                    }
                ]
            }
        },
        labelName: "First Name",
        type: VariablesTypes.Attribute,
        trackedEntity: "trackedEntity",
        placeholder: "First Name",
        unique: false,
        searchable: true,
    }
]

export const rowsActions: RowActionsType[] = [
    // { icon: <IconEdit24 />, color: '#277314', label: `Edition`, disabled: true, loading: false, onClick: () => { alert("Edition") } },
    // { icon: <IconDelete24 />, color: '#d64d4d', label: `Delete`, disabled: false, loading: false, onClick: () => { alert("Delete") } },
    // { icon: <IconCheckmarkCircle24 />, color: '#147cd7', disabled: false, loading: false, label: 'Complete', onClick: () => { alert("Complete") } }
];
