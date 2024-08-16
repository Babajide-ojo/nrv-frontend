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
    
export const getAllProperty = createAsyncThunk<any, {}>(
    "property/all",
    async (formData: any, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${API_URL}/properties/all?page=${formData.page}`);
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

export const getAllPropertyForTenant = createAsyncThunk<any, {}>(
    "property-tenant/all",
    async (formData: any, { rejectWithValue }) => {
      try {
        let url = `${API_URL}/rooms/all?page=${formData.page}`
        if(formData.searchTerm){
            url = url + `&search=${formData.searchTerm}`
        }

        if(formData.minimiumPrice){
            url = url + `&minPrice=${formData.minimiumPrice}`
        }
       
        if(formData.maximiumPrice){
            url = url + `&maxPrice=${formData.maximiumPrice}`
        }

    
        
        const response = await axios.get(url);
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

export const getAllLandlordApartment = createAsyncThunk<any, {}>(
    "property-tenant/landlord",
    async (formData: any, { rejectWithValue }) => {
      try {
        let url = `${API_URL}/rooms/all?page=100`
   

        if(formData.id){
            url = url + `&id=${formData.id}`
        } 
        const response = await axios.get(url);
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

export const getPropertyByIdForTenant = createAsyncThunk<UserId, {}>(
    "single-property-tenant/get",
    async (body: any, { rejectWithValue }) => {
        try {
            const response: any = await axios.get(`${API_URL}/rooms/single/tenant/${body?.id}/${body?.tenantId}`);
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

export const applyForProperty = createAsyncThunk< FormData, {}>(
    "property/apply",
    async (formData: any, { rejectWithValue }) => {
        try {
            const response: any = await axios.post(`${API_URL}/properties/apply`, formData);
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

export const getApplicationsByLandlordId = createAsyncThunk<any, {}>(
    "property/application",
    async (formData: any, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${API_URL}/properties/applications?id=${formData.id}&page=${formData.page}&status=${formData.status}`);
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

export const updateApplicationStatus = createAsyncThunk<any, {}>(
    "property/application-update",
    async (formData: any, { rejectWithValue }) => {
      try {
        let apiUrl = `${API_URL}/properties/application/update-status?id=${formData.id}&status=${formData.status}`;

        if (formData.roomId) {
          apiUrl += `&roomId=${formData.roomId}`;
        }
        const response = await axios.get(apiUrl);
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

export const inviteApplicant = createAsyncThunk<any, {}>(
    "property/invite-applicant",
    async (formData: any, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${API_URL}/properties/application/invite-applicant?name=${formData.name}&email=${formData.email}&landlordId=1`);
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

export const updateRoomStatus = createAsyncThunk<any, {}>(
    "room/update-status",
    async (formData: any, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${API_URL}/rooms/update/status?id=${formData.id}&status=${formData.status}`);
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

export const getApplicationCount = createAsyncThunk<any, {}>(
    "landlord/application-count",
    async (formData: any, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${API_URL}/properties/application-count?id=${formData.id}`);
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

export const getCurrentTenantForProperty = createAsyncThunk<UserId, {}>(
    "current-tenant/get",
    async (id: any, { rejectWithValue }) => {
        try {
            const response: any = await axios.get(`${API_URL}/rooms/active/tenant?id=${id}`);
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

export const getRentedApartmentsForTenant = createAsyncThunk<any, {}>(
    "current-tenant/properties",
    async (formData: any, { rejectWithValue }) => {
        try {
            const response: any = await axios.get(`${API_URL}/rooms/properties/renters?id=${formData.id}`);
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
            .addCase(getAllProperty.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(getAllProperty.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.data = action.payload;
            })
            .addCase(getAllProperty.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string;
            })
            .addCase(getApplicationsByLandlordId.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(getApplicationsByLandlordId.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.data = action.payload;
            })
            .addCase(getApplicationsByLandlordId.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string;
            })
            .addCase(updateApplicationStatus.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(updateApplicationStatus.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.data = action.payload;
            })
            .addCase(updateApplicationStatus.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string;
            })
            .addCase(inviteApplicant.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(inviteApplicant.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.data = action.payload;
            })
            .addCase(inviteApplicant.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string;
            })
            .addCase(getPropertyByIdForTenant.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(getPropertyByIdForTenant.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.data = action.payload;
            })
            .addCase(getPropertyByIdForTenant.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string;
            })
            .addCase(updateRoomStatus.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(updateRoomStatus.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.data = action.payload;
            })
            .addCase(updateRoomStatus.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string;
            })
            .addCase(getAllPropertyForTenant.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(getAllPropertyForTenant.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.data = action.payload;
            })
            .addCase(getAllPropertyForTenant.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string;
            })
            .addCase(getApplicationCount.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(getApplicationCount.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.data = action.payload;
            })
            .addCase(getApplicationCount.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string;
            })
            .addCase(getCurrentTenantForProperty.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(getCurrentTenantForProperty.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.data = action.payload;
            })
            .addCase(getCurrentTenantForProperty.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string;
            })
            .addCase(getRentedApartmentsForTenant.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(getRentedApartmentsForTenant.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.data = action.payload;
            })
            .addCase(getRentedApartmentsForTenant.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string;
            })
    },
});

// Export actions and reducer
export const { clearPropertyData } = propertySlice.actions;
export default propertySlice.reducer;
