const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ALPHANUMERIC = `0123456789${LETTERS}`

// DHIS2 uid (a letter + 10 letters/digits). The new enrollment gets its id before it is sent,
// so a refusal of the server can be traced back to the learner (SEMIS-225).
export function newUid(): string {
    let uid = LETTERS[Math.floor(Math.random() * LETTERS.length)]
    for (let i = 0; i < 10; i++) uid += ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)]
    return uid
}

// Learners whose new enrollment the server refused, with the reason given by the server.
// A refusal of the learner itself (TRACKED_ENTITY) also leaves the enrollment unsaved.
export function refusedEnrollments(report: any, sent: { trackedEntity: string, enrollment: string }[]): Record<string, string> {
    const errorReports: any[] = report?.validationReport?.errorReports ?? report?.response?.validationReport?.errorReports ?? []
    const refused: Record<string, string> = {}

    for (const { trackedEntity, enrollment } of sent) {
        const errors = errorReports.filter(error =>
            (error?.trackerType === 'ENROLLMENT' && error?.uid === enrollment) ||
            (error?.trackerType === 'TRACKED_ENTITY' && error?.uid === trackedEntity))

        if (errors.length) refused[trackedEntity] = errors.map(error => error?.message).filter(Boolean).join(' ')
    }

    return refused
}
