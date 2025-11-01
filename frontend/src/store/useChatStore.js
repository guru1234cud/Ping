import { create } from "zustand"
import axiosInstance from '../lib/axios.js'
import { toast } from 'react-hot-toast'

export const useChatStore = create((set) => ({
    messages: [],
    selectedUser: null,
    users: [],
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get(`/messages/users`)
            set({ users: res.data })
        } catch (error) {
            toast.error(error?.response?.data?.message || 'error while getting the users')
        } finally {
            set({ isUsersLoading: false })
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({ messages: res.data })
        } catch (error) {
            toast.error(error?.response?.data?.message || 'error while getting the messages')
        } finally {
            set({ isMessagesLoading: false })
        }
    }
}))