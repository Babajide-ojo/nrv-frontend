import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../config/constant";


interface VerificationState {
  data: any | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: VerificationState = {
  data: null,
  loading: "idle",
  error: null,
};

export const requestVerification = createAsyncThunk<any, {}>(
  "verification/request",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/verification/tenant`, payload);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "An error occurred, please try again later";
      return rejectWithValue(message);
    }
  }
);

// Verification slice
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
      });
  },
});

export const { clearVerificationData } = verificationSlice.actions;
export default verificationSlice.reducer;
