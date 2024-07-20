import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/authslice"; 
import adminauthReducer from "../admin-auth/adminauthslice";

export const store=configureStore({
    reducer:{
        auth:authReducer,
        adminauth:adminauthReducer
    },
})