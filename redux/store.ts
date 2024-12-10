import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import propertyReducer from './slices/propertySlice';
import maintenanceReducer from './slices/maintenanceSlice'
import messageReducer from './slices/messageSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        property: propertyReducer,
        maintenance: maintenanceReducer,
        messages: messageReducer
        // Add middleware or other configuration options as needed
    }});
