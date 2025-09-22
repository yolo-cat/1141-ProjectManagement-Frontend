import http from './http'

export function login(credentials) {
    return http.post('/login', credentials)
}
