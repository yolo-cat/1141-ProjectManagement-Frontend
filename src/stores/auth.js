import { reactive, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'

const state = reactive({
    token: localStorage.getItem('token') || null,
    user: null
})

function decodeToken() {
    if (state.token) {
        try {
            state.user = jwtDecode(state.token)
        } catch (e) {
            console.error('Invalid token:', e)
            localStorage.removeItem('token')
            state.token = null
            state.user = null
        }
    }
}

decodeToken() // Initial decode

export const authStore = {
    state,
    setToken(token) {
        state.token = token
        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }
        decodeToken()
    },
    logout() {
        this.setToken(null)
    },
    isAuthenticated: computed(() => !!state.token && !!state.user),
    userRole: computed(() => state.user?.roles?.[0] || null),
    userId: computed(() => state.user?.id || null),
    userName: computed(() => state.user?.name || null)
}
