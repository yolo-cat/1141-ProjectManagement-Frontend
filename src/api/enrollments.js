import http from './http'

export function fetchEnrollments() {
    return http.get('/enrollments')
}

export function fetchStudentEnrollments(studentId) {
    // 查詢學生已選課程
    return http.get(`/enrollments/student/${studentId}`)
}

export function getEnrollment(id) {
    // Note: The backend controller expects the ID in the request body for GET.
    // 這裡如需更標準，建議改為 /enrollments/student/{studentId}/course/{courseId}
    return http.get('/enrollments/get', { data: id })
}

export function createEnrollment(data) {
    return http.post('/enrollments', data)
}

export function updateEnrollment(data) {
    // The backend controller expects the full enrollment object for update.
    return http.put('/enrollments', data)
}

export function deleteEnrollment(enrollmentId) {
    // enrollmentId: { studentId, courseId }
    return http.delete('/enrollments', { data: enrollmentId })
}
