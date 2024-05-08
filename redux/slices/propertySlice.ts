import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from '../../config/constant';


interface PropertyState {
    data: any | null;
    loading: "idle" | "pending" | "succeeded" | "failed";
    error: string | null;
}



interface FormData {
    streetAddress: string;
    unit: string;
    city: string;
    state: string;
    zipCode: string;
    file: any;
    createdBy: string;
}


interface UserId {
    id: any;
}



const initialState: PropertyState = {
    data: null,
    loading: "idle",
    error: null,
}; 


export const createProperty = createAsyncThunk< FormData, {}>(
    "property/create",
    async (formData: any, { rejectWithValue }) => {
        try {
            const response: any = await axios.post(`${API_URL}/properties/add`, formData);
            console.log({response});
            
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

export const getPropertyByUserId = createAsyncThunk<UserId, {}>(
    "property/get",
    async (id: any, { rejectWithValue }) => {
        try {
            const response: any = await axios.get(`${API_URL}/properties/all/${id}`);
            console.log({response});
            
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



// Create user slice
const propertySlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearPropertyData: (state) => {
            state.data = null;
            state.loading = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProperty.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(createProperty.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.data = action.payload;
            })
            .addCase(createProperty.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string;
            })
            .addCase(getPropertyByUserId.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(getPropertyByUserId.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.data = action.payload;
            })
            .addCase(getPropertyByUserId.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string;
            })
    },
});

// Export actions and reducer
export const { clearPropertyData } = propertySlice.actions;
export default propertySlice.reducer;
