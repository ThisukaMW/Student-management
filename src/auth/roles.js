export const ROLES = { ADMIN: 'ADMIN', LECTURER: 'LECTURER', STUDENT: 'STUDENT' }

// Who may open the student list (matches the backend's @PreAuthorize rules)
export const STAFF_ROLES = [ROLES.ADMIN, ROLES.LECTURER]

export const ROLE_LABELS = { ADMIN: 'Admin', LECTURER: 'Lecturer', STUDENT: 'Student' }

export const isStaff = (role) => STAFF_ROLES.includes(role)

/** Where each role lands after logging in. */
export const homePathFor = (role) => (isStaff(role) ? '/students' : '/profile')
