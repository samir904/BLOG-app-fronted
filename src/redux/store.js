import {configureStore} from "@reduxjs/toolkit"
import authSliceReducer from "../redux/Slices/AuthSlice.js"

const store=configureStore({
    reducer:{
        auth:authSliceReducer
    },
    devTools:true
})

export default store;