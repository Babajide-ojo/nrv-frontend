import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api";
import { setUserFromPayment } from "./userSlice";
import {
  getSessionAccessToken,
  getSessionUserId,
  getStoredSession,
  isAccessTokenExpired,
} from "@/lib/authSession";
import { restoreSessionFromRememberMe } from "@/lib/rememberMe";

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
const extractErrorMessage = (error: any) => {
  const message = error.response?.data?.message;
  if (Array.isArray(message)) {
    const parts = message.map((item) => {
      if (item == null) {
        return "";
      }
      if (typeof item === "object") {
        return JSON.stringify(item);
      }
      return String(item);
    }).filter(Boolean);
    return parts.join(". ") || parts[0] || "An error occurred, please try again later";
  }
  if (message && typeof message === "object") {
    return JSON.stringify(message);
  }
  if (typeof message === "string" && message.trim()) {
    return message;
  }
  return "An error occurred, please try again later";
};

// ─── Thunks ─────────────────────────────────────────────

export const requestVerification = createAsyncThunk<any, {}>(
  "verification/request",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      let accessToken = getSessionAccessToken();
      if (!accessToken || isAccessTokenExpired(accessToken)) {
        const restored = await restoreSessionFromRememberMe();
        accessToken = restored?.accessToken || getSessionAccessToken();
      }
      if (!accessToken) {
        return rejectWithValue(
          "Your session has expired. Please sign in again to request verification.",
        );
      }

      const session = getStoredSession();
      const landlordId = getSessionUserId(session);
      const body = {
        ...(payload as Record<string, unknown>),
        ...(landlordId ? { requestedBy: landlordId } : {}),
      };

      const response = await apiClient.post("/verification/tenant", body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // API shape: { status, message, data: { message, data: verification, user } }
      const inner = response.data?.data;
      const updatedUser =
        inner?.user ?? response.data?.user ?? response.data?.data?.user;

      if (updatedUser && typeof updatedUser === "object") {
        const safe = { ...updatedUser };
        delete safe.password;

        const stored = localStorage.getItem("nrv-user");
        if (stored) {
          try {
            const current = JSON.parse(stored);
            current.user = safe;
            localStorage.setItem("nrv-user", JSON.stringify(current));
          } catch {
            // ignore
          }
        }
        dispatch(setUserFromPayment({ user: safe }));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("nrv-user-updated"));
        }
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const updateGuarantor = createAsyncThunk<any, { id: string; data: any }>(
  "verification/updateGuarantor",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/verification/guarantor/${id}`, data);
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
      const response = await apiClient.patch(`/verification/employment/${id}`, data);
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
      const response = await apiClient.patch(`/verification/affordability/${id}`, data);
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
 