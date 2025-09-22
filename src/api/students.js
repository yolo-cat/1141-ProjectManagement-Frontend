import http from './http'

export function fetchStudents() {
    return http.get('/students')
}

export function getStudent(id) {
    return http.get(`/students/${id}`)
}

export function createStudent(data) {
    return http.post('/students', data)
}

export function updateStudent(id, data) {
    return http.put(`/students/${id}`, data)
}

export function deleteStudent(id) {
    return http.delete(`/students/${id}`)
}

export function fetchEnrollmentsByStudent(studentId) {
    return http.get(`/students/${studentId}/enrollments`)
}

export function searchStudentsByFirstName(firstName) {
  return http.get('/students/search/firstname', { params: { firstName } });
}

export function searchStudentsByLastName(lastName) {
  return http.get('/students/search/lastname', { params: { lastName } });
}

export function searchStudentsByFullName(lastName, firstName) {
  return http.get('/students/search/fullname', { params: { lastName, firstName } });
}
