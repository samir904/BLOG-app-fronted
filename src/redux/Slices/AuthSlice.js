import{ createAsyncThunk,createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"
import axiosInstance from "../../Helpers/axiosInstance"
import toastStyles from "../../Helpers/Toaststyle.js"
const initialState={
    isLoggedIn:localStorage.getItem('isLoggedIn')||false,
    role:localStorage.getItem("role")||"",
   data:(() => {
      try {
        const data = localStorage.getItem("data");
        return data ? JSON.parse(data) : {};
      } catch (e) {
        console.error("Failed to parse localStorage data:", e);
        return {};
      }
    })(),

}

export const createAccount=createAsyncThunk("/auth/signup",async(data)=>{
    try{
        const res=axiosInstance.post("user/register",data)
        toast.promise(res,{
            loading:"Wait creating your account",
            success:(data)=>{
                return data?.data?.message||"Account created successfully"
            },
            error:"Failed to create account"

        },{
            loading:toastStyles.loading,
            success:toastStyles.success,
            error:toastStyles.error
        })
        return (await res).data;
    }catch(e){
        toast.error(e?.response?.data?.message,toastStyles.error)
    }
})

export const login=createAsyncThunk("/auth/login",async(data)=>{
    try{
        const res=axiosInstance.post("/user/login",data)
        toast.promise(res,{
            loading:"Wait authentication in process",
            success:(data)=>{
                return data?.data?.message ||"user loggedin successfully"
            },
            error:"failed to loggedin"
        },{
            loading:toastStyles.loading,
            success:toastStyles.success,
            error:toastStyles.error
        })
        return (await res).data;
    }catch(e){
        toast.error(e?.response?.data?.message,toastStyles.error)
    }
})

export const logout=createAsyncThunk("/auth/logout",async()=>{
    try{
        const res=axiosInstance.get("/user/logout")
        toast.promise(res,{
            loading:"wait logout in process",
            success:(data)=>{
                return data?.data?.message||"user loggedout successfully  "
            },
            error:'Failed to logged you out '
        },{
            loading:toastStyles.loading,
            success:toastStyles.success,
            error:toastStyles.success
        })
        return (await res).data
    }catch(e){
        toast.error(e?.response?.data?.message,toastStyles.error,toastStyles.error)
    }
        
})

export const getprofile=createAsyncThunk("/auth/getprofile",async()=>{
    try{
const res=axiosInstance.get("/user/getprofile")
    return (await (res)).data
    }catch(e){
        toast.error(e?.message,toastStyles.error)
    }
})

export const updateuserprofile=createAsyncThunk("/auth/update",async(data)=>{
    try{
        const res=axiosInstance.post("/user/update",data)
        toast.promise(res,{
            loading:"wait profile update in progress ",
            success:(data)=>{
                return data?.data?.message
            },
            error:"Failed to update your profile"
        },{
            loading:toastStyles.error,
            success:toastStyles.success,
            error:toastStyles.error
        })
        return (await res).data
    }catch(e){
        toast.error(e?.response?.data?.message,toastStyles.error)
    }
})

export const changepassword=createAsyncThunk("/auth/changepassword",async(data)=>{
    try{
        const res=axiosInstance.post("/change-password",data);
        toast.promise(res,{
            loading:"wait while we changing the password",
            success:(data)=>{
                return data?.data?.message
            },
            error:"Failed to update your password"
        },{
            loading:toastStyles.loading,
            success:toastStyles.success,
            error:toastStyles.error
        })
        return (await res).data
    }catch(e){
        toast.error(e?.response?.data?.message,toastStyles.error)
    }
})

export const  forgotpassword=createAsyncThunk("/auth/forgotpassword",async(data)=>{
    try{
        const res=axiosInstance.post("/reset",data);
        toast.promise(res,{
            loading:"wait sending you email",
            success:'email sent successfully ',
            error:'failed to send email'
        },{
            loading:toastStyles.loading,
            success:toastStyles.success,
            error:toastStyles.error
        })
    }catch(e){
        toast.error(e?.response?.data?.message,toastStyles.error)
    }
})

export const resetpassword=createAsyncThunk("/auth/resetpassword",async(data)=>{
    try{
        const res=axiosInstance.post(`/reset${data.resetToken}`,data)
        toast.promise(res,{
            loading:"wait updating your password",
            success:(data)=>{
                data?.data?.message
            },
            error:"Failed to update your password"
        },{
            loading:toastStyles.loading,
            success:toastStyles.success,
            error:toastStyles.error
        })
        return (await res).data
    }catch(e){
        toast.error(e?.response?.data?.message,toastStyles.error)
    }
})


const authslice=createSlice({
    name:"auth",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(createAccount.fulfilled,(state,action)=>{
            localStorage.setItem("isLoggedIn",true)
            localStorage.setItem("data",action?.payload?.user)
            localStorage.setItem("role",action?.payload?.user?.role)
            state.isLoggedIn=true;
            state.data=action?.payload?.user;
            state.role=action?.payload?.user?.role;
        })


        builder.addCase(login.fulfilled,(state,action)=>{
            localStorage.setItem("data",JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn",true);
            localStorage.setItem("role",action?.payload?.user?.role)
            state.isLoggedIn=true;
            state.data=action?.payload?.data;
            state.role=action?.payload?.user?.role
        })
        builder.addCase(logout.fulfilled,(state)=>{
            localStorage.clear();
            state.data={};
            state.isLoggedIn=false;
            state.role=""
        })
        //why we are setting this when we already seted it to login time
        builder.addCase(getprofile.fulfilled,(state,action)=>{
            localStorage.setItem("data",JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn",true);
            localStorage.setItem("role",action?.payload?.user?.role);
            state.isLoggedIn=true;
            state.data=action?.payload?.user;
            state.role=action?.payload?.user?.role;
        })
        
    }
})

export default authslice.reducer;