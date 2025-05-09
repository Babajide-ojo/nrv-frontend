import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import propertyReducer from './slices/propertySlice';
import maintenanceReducer from './slices/maintenanceSlice'
import messageReducer from './slices/messageSlice'
import documentReducer from './slices/documentSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        property: propertyReducer,
        maintenance: maintenanceReducer,
        messages: messageReducer,
        document: documentReducer
        // Add middleware or other configuration options as needed
    }});
