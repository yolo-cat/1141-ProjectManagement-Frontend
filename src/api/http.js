// src/api/http.js
import axios from 'axios'
import { authStore } from '@/stores/auth';

const http = axios.create({
    baseURL: '/api', // 由 Vite 代理轉發至後端
    headers: { 'Content-Type': 'application/json' }
})

http.interceptors.request.use(config => {
    const token = authStore.state.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default http
