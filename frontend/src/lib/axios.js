import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: process.env.BE_URL || "http://localhost:3001/api",
    withCredentials:true
})

