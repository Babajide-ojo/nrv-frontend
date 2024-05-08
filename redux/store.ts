import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import propertyReducer from './slices/propertySlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        property: propertyReducer
        // Add middleware or other configuration options as needed
    }});
