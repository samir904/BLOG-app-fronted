import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

import axiosInstance from "../../Helpers/axiosInstance.js";
import toast from "react-hot-toast";
import toastStyles from "../../Helpers/Toaststyle.js";


const initialState={
    allPost:[],
    post:null,
    loading:false,//for all post
    likeLoading: false, // For likePost
    error:null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalPosts: 0,
      hasMore: false,
    },
}
//done
export const getAllPost=createAsyncThunk("/post/get",async({ page = 1, limit = 10 } = {})=>{
    try{
        const res=axiosInstance.get(`/post?page=${page}&limit=${limit}`);
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

//done
export const createNewPost=createAsyncThunk("/post/create",async(data)=>{
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

//done
export const getPost=createAsyncThunk("/post/getpost",async(id,{ rejectWithValue })=>{
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
        return rejectWithValue(error?.response?.data?.message || "Failed to load post");
    }
})

//done
export const deletePost=createAsyncThunk("/post/delete",async(id)=>{
    try{
        const res=axiosInstance.delete(`/post/${id}`)
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


//done
export const updatePost = createAsyncThunk("/post/update", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = axiosInstance.put(`/post/${id}`, formData, {
      headers: { "content-type": "multipart/form-data" },
    });

    toast.promise(res, {
      loading: "Updating post...",
      success: "Post updated successfully",
      error: "Failed to update post",
    }, {
      loading: toastStyles.loading,
      success: toastStyles.success,
      error: toastStyles.error,
    });

    const response = await res;
    if (!response.data?.success) {
      return rejectWithValue(response.data.message || "Failed to update post");
    }
    return response.data;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "Failed to update the post";
    toast.error(errorMessage, toastStyles.error);
    return rejectWithValue(errorMessage);
  }
});

//done
export const likePost=createAsyncThunk("/post/likepost",async(id)=>{
    try{
        const res=axiosInstance.post(`/post/${id}/like`);
        
        const response=await res;
        return response.data
    }catch(error){
        toast.error(error?.response?.data?.message||"Failed to toggle like button")
    }
})

//done
export const createComment=createAsyncThunk("/post/createCOmment",async({postId,content}, { rejectWithValue })=>{
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
        const response=await res;
        return response.data.comment;
    }catch(error){
        toast.error(error?.response?.data?.message||"Failed to create comment",toastStyles.error)
    }
})

//done-no need 
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

//done
export const updateComment=createAsyncThunk("/comment/updateComment",
    async({commentId,content})=>{
        try{
            const res=axiosInstance.put(`/comment/${commentId}`,{content});
            toast.promise(res,{
                loading:"Updating comment...",
                success:"Comment upadted successfully",
                error:"Failed to update Comment",
            },{
                loading:toastStyles.loading,
                success:toastStyles.success,
                error:toastStyles.error
            });
            const response=await res;
            return response.data.comment;//return the updated comment
        }catch(error){
            toast.error(error?.response?.data?.message||"Failed to update comment ",toastStyles.error)
        }
    }
)


// done 
export const deleteComment = createAsyncThunk("/comment/delete", async ({ postId, commentId }, { rejectWithValue }) => {
    try {
        const res = axiosInstance.delete(`/comment/${commentId}`);
        
        const response = await res;
        return { commentId, postId }; // Explicitly return commentId and postId
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete the comment", toastStyles.error);
        return rejectWithValue(error?.response?.data?.message || "Failed to delete the comment");
    }
});

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

            // updatePost
    builder
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload; // Update the post in state
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

        //likepost
        builder
        .addCase(likePost.pending,(state)=>{
            state.likeLoading=true;// Use separate likeLoading state
            state.error=null
        })
        .addCase(likePost.fulfilled,(state,action)=>{
            state.loading=false;
            state.likeLoading=false
            state.post=action.payload.post;
            const index=state.allPost.findIndex((p)=>p._id===action.payload.post._id);
            if(index!==-1){
                state.allPost[index]=action.payload.post;
            }
        })
        .addCase(likePost.rejected,(state,action)=>{
            state.loading=false;
            state.likeLoading=false
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
        if(state.post){
            state.post.comments=[]//clear comments on error
        }
        });

        //updatecomment
        builder
        .addCase(updateComment.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        .addCase(updateComment.fulfilled,(state,action)=>{
            state.loading=false;
            if(state.post&&state.post.comments){
                const commentIndex=state.post.comments.findIndex((c)=>c._id===action.payload._id);
                if(commentIndex!==-1){
                    state.post.comments[commentIndex]=action.payload;//update the comment in the current post
                }
            }
            //update the comment in allpost array if the post exists
            const postIndex=state.allPost.findIndex((p)=>p._id===action.payload.post);
            if(postIndex !==-1&&state.allPost[postIndex].comments){
                const commentIndex=state.allPost[postIndex].comments.findIndex((c)=>c._id===action.payload._id);
                if(commentIndex!==-1){
                    state.allPost[postIndex].comments[commentIndex]=action.payload;
                }
            }
        })
        .addCase(updateComment.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"Failed to update the comment"
        })

        //deletecomment

        builder
        .addCase(deleteComment.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(deleteComment.fulfilled,(state,action)=>{
            state.loading=false;
            const{commentId,postId}=action.payload;
            //update the current post's comments
            if(state.post&&state.post._id===postId&&state.post.comments){
                state.post.comments=state.post.comments.filter((c)=>c._id!==commentId);
            }
            //update the post in allpost array
            const postIndex=state.allPost.findIndex((p)=>p._id===postId);
            if(postIndex!==-1&&state.allPost[postIndex].comments){
                state.allPost[postIndex].comments=state.allPost[postIndex].comments.filter((c)=>c._id!==commentId);
            }
        })
        .addCase(deleteComment.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"Failed to delete comments"
        })
        

    }
})


export default postSlice.reducer;


