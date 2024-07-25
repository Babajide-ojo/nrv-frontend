import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from '../../config/constant';


interface MaintenanceState {
    data: any | null;
    loading: "idle" | "pending" | "succeeded" | "failed";
    error: any | null;
}


// Define the initia l state
const initialState: MaintenanceState = {
    data: null,
    loading: "idle",
    error: null,
};

interface FormData {
    title: string;
    description: string;
    roomId: any;
    createdBy: any;
    file: any;

}

// Async thunk to fetch user data
export const createMaintenance = createAsyncThunk<FormData, {}>(
    "maintenance/create",
    async (formData: any, { rejectWithValue }) => {
        try {
            const response: any = await axios.post(`${API_URL}/maintenance/create`, formData
           
            );
            return response.data;
        } catch (error: any) {
            if (error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue("An error occurred, please try again later");
            }
        }
    }
);


export const getMaintenanceByUserId = createAsyncThunk<any, {}>(
    "maintenance/get",
    async (formData: any, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${API_URL}/maintenance/get-tenant-maintenance/${formData.roomId}/${formData.id}?page=${formData.page}`);
        return response.data;
      } catch (error: any) {
        if (error.response.data.message) {
          return rejectWithValue(error.response.data.message);
        } else {
          return rejectWithValue("An error occurred, please try again later");
        }
      }
    }
);
const maintenanceSlice = createSlice({
    name: "maintenance",
    initialState,
    reducers: {
        clearMaintenanceData: (state) => {
            state.data = null;
            state.loading = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createMaintenance.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(createMaintenance.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.data = action.payload;
            })
            .addCase(createMaintenance.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string;
            })
    },
});

// Export actions and reducer
export const { clearMaintenanceData } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
