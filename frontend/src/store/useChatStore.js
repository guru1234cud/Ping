import { create } from "zustand"
import {axiosInstance} from '../lib/axios.js'
import { toast } from 'react-hot-toast'
import { useAuthStore } from "./useAuthStore.js"

export const useChatStore = create((set,get) => ({
    messages: [],
    selectedUser: null,
    users: [],
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get(`/message/users`)
            set({ users: res.data })
            console.log(res.data);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'error while getting the users')
        } finally {
            set({ isUsersLoading: false })
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/message/${userId}`)
            set({ messages: res.data })
            console.log(res.data);
            
        } catch (error) {
            toast.error(error?.response?.data?.message || 'error while getting the messages')
        } finally {
            set({ isMessagesLoading: false })
        }
    },
    sendMessage: async (data)=>{
        const {selectedUser,messages} = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, data);
            set({messages: [...messages, res.data]});
        }catch(err){
            toast.error(err?.response?.data?.message || 'error while sending message')
        }
    },
    subscribeToMessages: ()=>{
        const {selectedUser} = get();
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
            set({messages:[...get().messages,newMessage]})
        })
    },
    unsubscribeFromMessages: ()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
    setSelectedUser: (selectedUser) => set({ selectedUser})
}))

