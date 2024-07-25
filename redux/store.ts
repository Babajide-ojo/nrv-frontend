import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import propertyReducer from './slices/propertySlice';
import maintenanceReducer from './slices/maintenanceSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        property: propertyReducer,
        maintenance: maintenanceReducer
        // Add middleware or other configuration options as needed
    }});
