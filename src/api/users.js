import http from './http'

export function fetchAllUsers() {
    return http.get('/users')
}

export function loginAs(username) {
    return http.post(`/login-as/${username}`)
}

export function loginAsId(id, role) {
    return http.post('/login-as-id', { id, role });
}

export function deleteUser(id) {
    return http.delete(`/users/${id}`);
}
