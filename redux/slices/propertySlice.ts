import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from '../../config/constant';


interface PropertyState {
    data: any | null;
    loading: "idle" | "pending" | "succeeded" | "failed";
    error: string | null;
}

interface GetPropertyByUserIdArgs {
    id: any;
    page: number;
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

export const updateProperty = createAsyncThunk< FormData, {}>(
    "/properties/update",
    async (formData: any, { rejectWithValue }) => {
   
        try {
            const response: any = await axios.patch(`${API_URL}/properties/update?propertyId=${formData.id}`, formData?.body);
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


  
  export const getPropertyByUserId = createAsyncThunk<any, {}>(
    "property/get",
    async (formData: any, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${API_URL}/properties/all/${formData.id}?page=${formData.page}`);
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

export const getPropertyById = createAsyncThunk<UserId, {}>(
    "single-property/get",
    async (id: any, { rejectWithValue }) => {
        try {
            const response: any = await axios.get(`${API_URL}/properties/single/${id}`);
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

export const getRoomById = createAsyncThunk<UserId, {}>(
    "single-room/get",
    async (id: any, { rejectWithValue }) => {
        try {
            const response: any = await axios.get(`${API_URL}/rooms/single/${id}`);
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

export const createRooms = createAsyncThunk< FormData, {}>(
    "room/create",
    async (formData: any, { rejectWithValue }) => {
        try {
            const response: any = await axios.post(`${API_URL}/rooms/create`, formData);
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

export const deleteDocumentById = createAsyncThunk<UserId, {}>(
    "properties/delete-document",
    async (body: any, { rejectWithValue }) => {
        try {
            const response: any = await axios.delete(`${API_URL}/properties/delete-document?id=${body.id}&documentUrl=${body.documentUrl}`);
            return response.data;
        } catch (error: any) {
            if (error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue("An error occurred, please try again later");
            }
        }
    }
)

export const deletePropertyById = createAsyncThunk<UserId, {}>(
    "properties/delete-property",
    async (id: any, { rejectWithValue }) => {
        try {
            const response: any = await axios.delete(`${API_URL}/properties/delete/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue("An error occurred, please try again later");
            }
        }
    }
)


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
            .addCase(getPropertyById.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(getPropertyById.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.data = action.payload;
            })
            .addCase(getPropertyById.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string;
            })
            .addCase(deleteDocumentById.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(deleteDocumentById.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.data = action.payload;
            })
            .addCase(deleteDocumentById.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string;
            })
            .addCase(deletePropertyById.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(deletePropertyById.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.data = action.payload;
            })
            .addCase(deletePropertyById.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string;
            })
    },
});

// Export actions and reducer
export const { clearPropertyData } = propertySlice.actions;
export default propertySlice.reducer;
