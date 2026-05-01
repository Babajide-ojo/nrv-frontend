import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from '../../config/constant';


interface MessagesState {
  data: any | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: any | null;
}


// Define the initia l state
const initialState: MessagesState = {
  data: null,
  loading: "idle",
  error: null,
};

// interface FormData {
//   title: string;
//   description: string;
//   roomId: any;
//   createdBy: any;
//   file: any;

// }

// Async thunk to fetch user data
export const sendMessage = createAsyncThunk<FormData | any, {}>(
  "message/send",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response: any = await axios.post(`${API_URL}/messages/send`, formData

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


export const getConversation = createAsyncThunk<any, {}>(
  "messages/send",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/messages/conversation/${formData.senderId}/${formData.recipientId}`);
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

// export const getMaintenanceById = createAsyncThunk<any, {}>(
//   "maintenance/get",
//   async (formData: any, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_URL}/maintenance/single/${formData.id}`);
//       return response.data;
//     } catch (error: any) {
//       if (error.response.data.message) {
//         return rejectWithValue(error.response.data.message);
//       } else {
//         return rejectWithValue("An error occurred, please try again later");
//       }
//     }
//   }
// );

// export const getTenantByMaintenance = createAsyncThunk<any, {}>(
//   "tenants/maintenance",
//   async (formData: any, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_URL}/maintenance/get-tenant-maintenance/${formData.id}`);
//       return response.data;
//     } catch (error: any) {
//       if (error.response.data.message) {
//         return rejectWithValue(error.response.data.message);
//       } else {
//         return rejectWithValue("An error occurred, please try again later");
//       }
//     }
//   }
// );

// export const markIssueAsResolved = createAsyncThunk<any, {}>(
//   "maintenance/resolve",
//   async (formData: any, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_URL}/maintenance/resolve/${formData.id}`);
//       return response.data;
//     } catch (error: any) {
//       if (error.response.data.message) {
//         return rejectWithValue(error.response.data.message);
//       } else {
//         return rejectWithValue("An error occurred, please try again later");
//       }
//     }
//   }
// );

const messageSlice = createSlice({
  name: "messages",
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
      .addCase(sendMessage.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      .addCase(getConversation.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(getConversation.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(getConversation.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
  },
});

// Export actions and reducer
export const { clearMaintenanceData } = messageSlice.actions;
export default messageSlice.reducer;
