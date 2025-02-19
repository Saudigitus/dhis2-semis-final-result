
interface ModalProps {
    open: boolean
    setOpen: (value: boolean) => void
    title: string
    children: React.ReactNode
}

interface ModalContentProps {
    setOpen: (value: boolean) => void
    sectionName?: any
    enrollmentsData?: any
    bulkUpdate?: boolean
}

interface ModalContentUpdateProps {
    setOpen: (value: boolean) => void
    sectionName?: any
    formInitialValues?: any
    enrollmentsData?: any
    loadingInitialValues: boolean
    enrollmentValues?: any
}

interface ModalSearchTemplateProps {
    setOpen: (value: boolean) => void
    sectionName: string
    setOpenNewEnrollment: (value: boolean) => void
}

interface ModalDeleteContentProps {
    setOpen: (value: boolean) => void
    sectionName?: any
    initialValues?: any
    loading: boolean
}

interface ModalExportTemplateProps {
    setOpen: (value: boolean) => void
    sectionName: string
}

interface useExportTemplateProps {
    academicYearId: string
    orgUnit: string
    orgUnitName: string
    studentsNumber: string,
    setLoadingExport?: any
}

export type { ModalProps, ModalContentProps, ModalContentUpdateProps, ModalSearchTemplateProps, ModalDeleteContentProps, ModalExportTemplateProps, useExportTemplateProps }
