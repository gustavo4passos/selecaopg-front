import axios from 'axios'
import { getToken } from './auth'
import { API } from './defaultProps'

const api = axios.create({
    baseURL: API
})

api.interceptors.request.use(async config => {
    const token = getToken()

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default api