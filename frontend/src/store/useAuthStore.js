import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-hot-toast'

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data })
        } catch (err) {
            set({ authUser: null });
            console.log(err);
        }
        finally {
            set({ isCheckingAuth: false })
        }
    },
    signup: async (data) => {
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully!");
        } catch (error) {
            console.log("error from signup" + error);
            toast.error(error.response?.data?.message || "Signup failed. Please try again.");
        }
        finally {
            set({ isSigningUp: false });
        }
    },
    logout: async () => {
        const loadid = toast.loading("Logging out...");
        try{
            await axiosInstance.post("/auth/logout");
            toast.success("Logged out successfully");
            set({authUser:null});
        }catch(err){
            console.log("error from logout", err);
            toast.error("Logout failed. Please try again.");
        }finally{
            toast.dismiss(loadid);
        }
    },
    signin:async (data) =>{
        try{
            const res = await axiosInstance.post("auth/login",data);
            toast.success("Logged in successfully");
            set({authUser:res.data});
        }catch(err){
            toast.error(err.response?.data?.message || "Login failed. Please try again.");
            console.log("error from signin", err);
        }finally{
            set({isLoggingIn:false})
        }
    },
    updateProfile: async (data) =>{
        set({ isUpdatingProfile: true });
        try{
            const res = await axiosInstance.put("/auth/update-profile", data);
            
            set({ authUser: res.data });
            toast.success("Profile updated successfully!");

        }catch(err){
            toast.error(err.response?.data?.message || "Profile update failed. Please try again.");
            console.log("error from updateProfile", err);
        }finally{
            set({ isUpdatingProfile: false });
        }
    }
}
));
