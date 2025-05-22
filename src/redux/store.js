import {configureStore} from "@reduxjs/toolkit"
import authSliceReducer from "../redux/Slices/AuthSlice.js"
import postSliceReducer from "../redux/Slices/PostSlice.js"
const store=configureStore({
    reducer:{
        auth:authSliceReducer,
        post:postSliceReducer,
    },
    devTools:true
})

export default store;