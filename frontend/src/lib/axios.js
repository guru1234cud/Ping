import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BE_URL || "http://localhost:3001/api",
    withCredentials:true
})

