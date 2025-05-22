import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

import axiosInstance from "../../Helpers/axiosInstanc.js";
import toast from "react-hot-toast";
import toastStyles from "../../Helpers/Toaststyle.js";
import { error } from "console";
import { response } from "express";

const initialState={
    allPost:[],
    post:null,
    loading:false,
    error:null
}

export const getAllPost=createAsyncThunk("/post/get",async()=>{
    try{
        const res=axiosInstance.get("/post");
        toast.promise(res,{
            loading:'Wait loading posts',
            success:'Posts loaded successfully',
            error:"Failed to load post"
        },{
            loading:toastStyles.loading,
            success:toastStyles.success,
            error:toastStyles.error
        })
        return (await res).data.posts
    }catch(error){
        toast.error(error?.res?.data?.message)
    }
})

export const createNewPost=createAsyncThunk("/post/creste",async(data)=>{
    try{
        const res=axiosInstance.post("/post/create",data)
        toast.promise(res,{
            loading:"Wait creating your post",
            success:"Post created successfully",
            error:"Failed to create post"
        },{
            loading:toastStyles.loading,
            success:toastStyles.success,
            error:toastStyles.error
        })
        return (await res).data
    }catch(error){
        toast.error(error?.res?.data?.message)
    }
})

export const getPost=createAsyncThunk("/post/getpost",async(id)=>{
    try{
        const res=axiosInstance.get(`/post/${id}`);
        toast.promise(res,{
            loading:"Loading post...",
            success:'POst loaded successfully',
            error:"Failed to load post",
        },{
            loading:toastStyles.loading,
            success:toastStyles.success,
            error:toastStyles.error
        })

        const resposnse=await res;
        return resposnse.data.post;
    }catch(error){
        toast.error(error?.response?.data?.message||"failed to load post")
    }
})

export const deletePost=createAsyncThunk("/post/delete",async(id)=>{
    try{
        const res=axiosInstance.delete(`/post${id}`)
        toast.promise(res,{
            loading:"Deleting your post...",
            success:"POst deleted successfully",
            error:'Failed to delete the post'
        },{
            loading:toastStyles.loading,
            success:toastStyles.success,
            error:toastStyles.error
        })
        return (await res).data
    }catch(error){
        toast.error(error?.response?.data?.message,toastStyles.error)
    }
})

export const updatePost=createAsyncThunk("/post/update",async(id,data)=>{
    try{
        const res=axiosInstance.put(`/post/${id}`,data,{
            headers:{"content-type":"multipart/form-data"},
        });
        toast.promise(res,{
            loading:"Updating post...",
            success:"Post updated successfully",
            error:"Failed to update post"
        },{
            loading:toastStyles.loading,
            success:toastStyles.success,
            error:toastStyles.error
        })
        const resposnse=await res;
        return resposnse.data.post;
    }catch(error){
        toast.error(error?.response?.data?.message||"failed to update the course")
    }
})


export const likePost=createAsyncThunk("/post/likepost",async(id)=>{
    try{
        const res=axiosInstance.post(`/post/${id}/like`);
        toast.promise(res,{
            loading:'Toggling like...',
            success:(data)=>data.data.message,//dynamic message from backend
            error:"Failed to toggle like",
        },{
            loading:toastStyles.loading,
            success:toastStyles.success,
            error:toastStyles.error
        })
        const response=await res;
        return response.data
    }catch(error){
        toast.error(error?.response?.data?.message||"Failed to toggle like button")
    }
})

export const createComment=createAsyncThunk("/post/createCOmment",async({postId,content})=>{
    try{
        const res=axiosInstance.post(`/post/${postId}/comment`,{content})
        toast.promise(res,{
            loading:"Creating comment...",
            success:'Comment created successfully',
            error:"Failed to create comment"
        },{
            loading:toastStyles.loading,
            success:toastStyles.success,
            error:toastStyles.error
        })
        const reponse=await res;
        return response.data.comment;
    }catch(error){
        toast.error(error?.response?.data?.message||"Failed to create comment",toastStyles.error)
    }
})

export const getComments=createAsyncThunk("/post/getcomments",async(postId)=>{
    try{
        const res=axiosInstance.get(`/post/${postId}/comments`)
        toast.promise(res,{
            loading:"Loading comments...",
            success:'comments loaded successfully',
            error:'Failed to load comment'
        },{
            loading:toastStyles.loading,
            success:toastStyles.success,
            error:toastStyles.error
        })
        const response=await res;
        return response.data.comments
    }catch(error){
        toast.error(error?.response?.data?.message||"Failed to get comments")
    }
})

const postSlice=createSlice({
    name:'post',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        //getallpost
        builder
        .addCase(getAllPost.pending,(state)=>{
            state.loading=true;
            state.error=null;
            state.allPost=[];
        })
        .addCase(getAllPost.fulfilled,(state,action)=>{
            state.loading=false;
            state.allPost=action.payload||[];
        })
        .addCase(getAllPost.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.error.message||"Failed to fetch posts";
            state.allPost=[]
        });

        //createnewpost

        builder
        .addCase(createNewPost.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(createNewPost.fulfilled,(state,action)=>{
            state.loading=false;
            if(action.payload?.post){
                state.allPost=[action.payload.post,...state.allPost];
            }
        })
        .addCase(createNewPost.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.error.message||"Failed to create post"
        });

        //getpost
        builder
        .addCase(getPost.pending,(state)=>{
            state.loading=true;
            state.error=null;
            state.post=null
        })
        .addCase(getPost.fulfilled,(state,action)=>{
            state.loading=false,
            state.post=action.payload;
        })
        .addCase(getPost.rejected,(state,action)=>{
            state.loading=false;
            state.error=action?.payload?.message||"Failed to fetch post";
            state.post=null
        });

        //updatepost
        builder
        .addCase(updatePost.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        .addCase(updatePost.fulfilled,(state,action)=>{
            state.loading=false;
            state.post=action.payload;
            const index=state.allPost.findIndex((p)=>p._id===action.payload._id);
            if(index!==-1){
                state.allPost[index]=action.payload
            }
        })
        .addCase(updatePost.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"Failed to update the post"
        });

        //likepost
        builder
        .addCase(likePost.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        .addCase(likePost.fulfilled,(state,action)=>{
            state.loading=false;
            state.post=action.payload.post;
            const index=state.allPost.findIndex((p)=>p._id===action.payload.post._id);
            if(index!==-1){
                state.allPost[index]=action.payload.post;
            }
        })
        .addCase(likePost.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"Failed to toggle like button"
        });

        //createcomment
        builder
        .addCase(createComment.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        .addCase(createComment.fulfilled,(state,action)=>{
            state.loading=false;
            if(state.post){
                state.post.comments=[...state.post.comments,action.payload] //add the new comment to the current post
            }
            //update the post in all post array if exists
            const index=state.allPost.findIndex((p)=>p._id===action.payload.post);
            if(index!==-1){
                state.allPost[index].comments=[...state.allPost[index].comments,action.payload];
            }
        })
        .addCase(createComment.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"Failed to create comment"
        });

        //getcomments
        builder
        .addCase(getComments.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        .addCase(getComments.fulfilled,(state,action)=>{
            state.loading=false;
            if(state.post){
                state.post.comments=action.payload||[] ;//update the current post comment
            }
            //update the post in all post array if it exists
            const postId=action.meta.arg;//postId passed to the thunk
            const index=state.allPost.findIndex((p)=>p._id===postId);
            if(index!==-1){
                state.allPost[index].comments=action.payload ||[];
            }
        })
        .addCase(getComments.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"Failed to fetch the comments"
        })
        if(state.post){
            state.post.comments=[]//clear comments on error
        }

    }
})

export default postSlice.reducer;


