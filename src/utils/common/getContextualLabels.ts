export const getContextualLabels = (sectionType: string) => {
    const isStaff = sectionType === 'staff';

    return {
        assignButtonLabel: isStaff ? 'Assign re-enrollment status' : 'Assign final result',
        promoteButtonLabel: isStaff ? 'Perform re-enrollment' : 'Perform promotion',
        bulkButtonLabel: isStaff ? 'Bulk Staff Re-enrollment' : 'Bulk Final Result',

        assignModalTitle: isStaff ? 'Assign Re-enrollment Status' : 'Assign Final Result',
        promoteModalTitle: isStaff ? 'Perform Re-enrollment' : 'Perform Promotion',

        formName: isStaff ? 'Staff re-enrollment' : 'Student promotion',
        formDescription: isStaff ? 'Staff re-enrollment' : 'Student promotion',
        assignFormName: isStaff ? 'Staff Re-enrollment Status' : 'Final Result',
        assignFormDescription: isStaff ? 'Staff re-enrollment status' : 'Student final result',

        noResultMessage: isStaff
            ? 'Some selected staff have no re-enrollment status or were not re-enrolled.'
            : 'Some selected students have no final result or were not promoted.',
        selectOrgUnitTooltip: 'Please select an organisation unit before',
        selectFiltersTooltip: isStaff
            ? 'Please select type of staff and employment type'
            : 'Please select section and grade',

        successLabel: isStaff ? 'Re-enrolled staff' : 'Promoted students',
        failureLabel: isStaff ? 'Not re-enrolled staff' : 'No promoted students',
        summaryTitle: isStaff ? 'Staff Re-enrollment Summary' : 'Students Promotion Summary',
        summaryPreviewTag: isStaff ? 'Staff re-enrollment preview' : 'Students promotion preview',
        conflictMessage: isStaff
            ? 'The following staff were not re-enrolled. They already exist on the selected academic year'
            : 'The following students were not promoted. They already exist on the selected academic year',

        exportLabel: isStaff ? 'Export Staff Re-enrollment' : 'Export Final Result',
        bulkImportTitle: isStaff ? 'Bulk Staff Re-enrollment' : 'Bulk Final Result',

        // Entity references
        entityName: isStaff ? 'staff' : 'student',
        entityNamePlural: isStaff ? 'staff' : 'students',
    };
};
