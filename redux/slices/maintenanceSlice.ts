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

export const updateMaintenance = createAsyncThunk<any, { id: any; formData: any }>(
  "maintenance/update",  // Changed the action type to "maintenance/update"
  async (payload: { id: any; formData: any }, { rejectWithValue }) => {
    try {
      // Make sure the URL includes the dynamic 'id' as part of the request
      const response: any = await axios.put(
        `${API_URL}/maintenance/update/${JSON.parse(payload.id)}`, // Use the payload.id in the URL
        payload.formData
      );
      return response.data;
    } catch (error: any) {
      // Check for error response message
      if (error.response?.data?.message) {
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

export const getMaintenanceByOwnerId = createAsyncThunk<any, {}>(
  "maintenance/landlord",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/maintenance/get-landlord-maintenance/${formData.ownerId}/?page=${formData.page}`);
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

export const getMaintenanceById = createAsyncThunk<any, {}>(
  "maintenance/get",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/maintenance/single/${formData.id}`);
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

export const getTenantByMaintenance = createAsyncThunk<any, {}>(
  "tenants/maintenance",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/maintenance/get-tenant-maintenance/${formData.id}`);
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

export const markIssueAsResolved = createAsyncThunk<any, {}>(
  "maintenance/resolve",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/maintenance/resolve/${formData.status}/${formData.id}`);
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
      .addCase(getMaintenanceById.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(getMaintenanceById.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(getMaintenanceById.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      .addCase(markIssueAsResolved.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(markIssueAsResolved.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(markIssueAsResolved.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      .addCase(getMaintenanceByOwnerId.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(getMaintenanceByOwnerId.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(getMaintenanceByOwnerId.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      .addCase(getTenantByMaintenance.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(getTenantByMaintenance.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(getTenantByMaintenance.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
  },
});

// Export actions and reducer
export const { clearMaintenanceData } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
