import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../config/constant";

// Define state type
interface VerificationState {
  data: any | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

// Initial state
const initialState: VerificationState = {
  data: null,
  loading: "idle",
  error: null,
};

// Helper function for error messages
const extractErrorMessage = (error: any) =>
  error.response?.data?.message || "An error occurred, please try again later";

// ─── Thunks ─────────────────────────────────────────────

export const requestVerification = createAsyncThunk<any, {}>(
  "verification/request",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/verification/tenant`, payload);
      
      console.log('[requestVerification] Full response.data:', response.data);
      console.log('[requestVerification] response.data.user:', response.data?.user);
      console.log('[requestVerification] response.data.data?.user:', response.data?.data?.user);
      
      // Update localStorage with the fresh user data (includes updated credit counts)
      // Check both possible locations for user data
      const updatedUser = response.data?.user || response.data?.data?.user;
      if (updatedUser) {
        console.log('[requestVerification] Found user, standardVerificationUsed:', updatedUser.standardVerificationUsed);
        const stored = localStorage.getItem("nrv-user");
        if (stored) {
          const current = JSON.parse(stored);
          current.user = updatedUser;
          localStorage.setItem("nrv-user", JSON.stringify(current));
          console.log('[requestVerification] localStorage updated');
        }
      } else {
        console.log('[requestVerification] No user data in response');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const updateGuarantor = createAsyncThunk<any, { id: string; data: any }>(
  "verification/updateGuarantor",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/verification/guarantor/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const updateEmployment = createAsyncThunk<any, { id: string; data: any }>(
  "verification/updateEmployment",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/verification/employment/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const updateAffordability = createAsyncThunk<any, { id: string; data: any }>(
  "verification/updateAffordability",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/verification/affordability/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// ─── Slice ──────────────────────────────────────────────

const verificationSlice = createSlice({
  name: "verification",
  initialState,
  reducers: {
    clearVerificationData: (state) => {
      state.data = null;
      state.loading = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Request verification
      .addCase(requestVerification.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(requestVerification.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(requestVerification.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })

      // Update Guarantor
      .addCase(updateGuarantor.fulfilled, (state, action) => {
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(updateGuarantor.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Update Employment
      .addCase(updateEmployment.fulfilled, (state, action) => {
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(updateEmployment.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Update Affordability
      .addCase(updateAffordability.fulfilled, (state, action) => {
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(updateAffordability.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// ─── Exports ─────────────────────────────────────────────

export const { clearVerificationData } = verificationSlice.actions;
export default verificationSlice.reducer;
 