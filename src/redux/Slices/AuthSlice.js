import{ createAsyncThunk,createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"
import axiosInstance from "../../Helpers/axiosInstance"
import toastStyles from "../../Helpers/Toaststyle.js"
const initialState = (() => {
    let isLoggedIn = localStorage.getItem('isLoggedIn') === "true";
    let data = {};
    let role = "";
    try {
        const stored = localStorage.getItem("data");
        if (stored && stored !== "undefined") {
            data = JSON.parse(stored);
            role = data?.role || "";
        }
    } catch (e) {
        data = {};
        role = "";
    }
    // If isLoggedIn is true but no user data, force logout
    if (isLoggedIn && (!data || Object.keys(data).length === 0)) {
        isLoggedIn = false;
        role = "";
    }
    return {
        isLoggedIn,
        data,
        role,
    };
})();

export const createAccount = createAsyncThunk("/auth/signup", async (data, { rejectWithValue }) => {
  try {
    const res = axiosInstance.post("user/register", data);
    toast.promise(res, {
      loading: "Wait creating your account",
      success: (data) => {
        return data?.data?.message || "Account created successfully";
      },
      error: (error) => {
        return error?.response?.data?.message || "Failed to create account";
      },
    }, {
      loading: toastStyles.loading,
      success: toastStyles.success,
      error: toastStyles.error
    });
    return (await res).data;
  } catch (e) {
    return rejectWithValue(e?.response?.data || { message: "Failed to create account" });
  }
});

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
        const res=axiosInstance.post("/user/reset",data);
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
        const res=axiosInstance.post(`/user/reset/${data.resetToken}`, { password: data.password })
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
        builder.addCase(createAccount.fulfilled, (state, action) => {
    const user = action?.payload?.user || action?.payload?.data || action?.payload;
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("data", JSON.stringify(user));
    localStorage.setItem("role", user?.role || "user");
    state.isLoggedIn = true;
    state.data = user;
    state.role = user?.role || "user";
});

builder.addCase(login.fulfilled, (state, action) => {
    const user = action?.payload?.user || action?.payload?.data || action?.payload;
    localStorage.setItem("data", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("role", user?.role || "user");
    state.isLoggedIn = true;
    state.data = user;
    state.role = user?.role || "user";
});

builder.addCase(getprofile.fulfilled, (state, action) => {
    const user = action?.payload?.user || action?.payload?.data || action?.payload;
    localStorage.setItem("data", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("role", user?.role || "user");
    state.isLoggedIn = true;
    state.data = user;
    state.role = user?.role || "user";
});
builder.addCase(logout.fulfilled, (state) => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("data");
    localStorage.removeItem("role");
    state.isLoggedIn = false;
    state.data = {};
    state.role = "";
});
builder.addCase(updateuserprofile.fulfilled, (state, action) => {
    const user = action?.payload?.user || action?.payload?.data || action?.payload;
    localStorage.setItem("data", JSON.stringify(user));
    state.data = user;
    state.role = user?.role || "user";
});
    }
})

export default authslice.reducer;