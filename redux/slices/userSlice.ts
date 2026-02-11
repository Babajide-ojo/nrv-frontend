import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from '../../config/constant';
import { 
  User, 
  UserToken, 
  LoginFormData, 
  SignUpFormData, 
  AsyncState,
  ApiResponse 
} from '@/types';


// State interface using centralized types
interface UserState extends AsyncState<UserToken> {}

// Request interfaces
interface VerifyData {
  confirmationCode: string;
  email: string;
}

interface VerifyEmailRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

interface LandlordUserData {
  firstName: string;
  lastName: string;
  email: string;
  nin: string;
  propertyId: string;
  ownerId: string;
  rentEndDate?: string;
  rentStartDate?: string;
  accountType: string;
}

interface UpdateUserRequest {
  id: string;
  payload: Partial<User> | FormData;
}

interface TenancyRequest {
  id: string;
  rentEndDate?: string;
  rentStartDate?: string;
}

// Initial state
const initialState: UserState = {
  data: null,
  loading: "idle",
  error: null,
};

// API helper function
const handleApiError = (error: any): string => {
  console.log({error})
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return "An error occurred, please try again later";
};

// Async thunks
export const createUser = createAsyncThunk<UserToken, SignUpFormData>(
  "user/create",
  async (formData: SignUpFormData, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse<UserToken>>(
        `${API_URL}/users`, 
        formData,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      localStorage.setItem("emailToVerify", JSON.stringify(response.data));
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateUser = createAsyncThunk<UserToken, UpdateUserRequest>(
  "user/update",
  async ({ id, payload }: UpdateUserRequest, { rejectWithValue }) => {
    try {
      const response = await axios.put<ApiResponse<UserToken>>(
        `${API_URL}/users/${id}`, 
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const verifyAccount = createAsyncThunk<UserToken, VerifyData>(
  "user/verify",
  async (verifyData: VerifyData, { rejectWithValue }) => {
    try {
      const response: any = await axios.post<ApiResponse<UserToken>>(
        `${API_URL}/users/confirm-account`, 
        verifyData,
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      
      // Save the user data in the expected format
      const userData = {
        user: response.data.user,
        accessToken: response.data.accessToken,
        notificationSettings: response.data.notificationSettings
      };
      localStorage.setItem("nrv-user", JSON.stringify(userData));
      return userData;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const loginUser = createAsyncThunk<UserToken, LoginFormData>(
  "user/login",
  async (loginData: LoginFormData, { rejectWithValue }) => {
    try {
      const response: any = await axios.post<ApiResponse<UserToken>>(
        `${API_URL}/auth/login`, 
        loginData,
        {
          headers: { "Content-Type": "application/json" }
        }
      );
console.log({response})
      // Save the user data in the expected format
      const userData = {
        user: response.data.user,
        accessToken: response.data.accessToken,
        notificationSettings: response.data.notificationSettings
      };

      console.log({userData})
      // Only persist a session for verified/active users.
      // For inactive users, store the email so they can verify, but don't create a session token.
      if (userData?.user?.status === "inactive") {
        localStorage.removeItem("nrv-user");
        if (userData?.user?.email) {
          localStorage.setItem("emailToVerify", JSON.stringify({ data: { email: userData.user.email } }));
        }
      } else {
        localStorage.setItem("nrv-user", JSON.stringify(userData));
        localStorage.removeItem("emailToVerify");
      }
      return userData;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createUserByLandlord = createAsyncThunk<UserToken, LandlordUserData>(
  "user/create/landlord",
  async (formData: LandlordUserData, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse<UserToken>>(
        `${API_URL}/users/landlord`, 
        formData,
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getTenantsOnboardedByLandlord = createAsyncThunk<any, { id: string }>(
  "onboarded-by-landlord/get",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse<any>>(
        `${API_URL}/properties/tenant/landlord-onboarded?id=${id}`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const verifyEmail = createAsyncThunk<UserToken, VerifyEmailRequest>(
  "user/reset-code-token",
  async (verifyEmail: VerifyEmailRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse<UserToken>>(
        `${API_URL}/users/request-password-reset`, 
        verifyEmail,
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const resetPassword = createAsyncThunk<UserToken, ResetPasswordRequest>(
  "user/reset-password",
  async (resetData: ResetPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse<UserToken>>(
        `${API_URL}/users/reset-password`, 
        resetData,
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const endTenancyTenure = createAsyncThunk<UserToken, TenancyRequest>(
  "tenancy/end",
  async ({ id }: TenancyRequest, { rejectWithValue }) => {
    try {
      const response = await axios.put<ApiResponse<UserToken>>(
        `${API_URL}/rooms/${id}/end-tenure`,
        {},
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const extendTenancyTenure = createAsyncThunk<UserToken, TenancyRequest>(
  "tenancy/update",
  async ({ id, rentEndDate }: TenancyRequest, { rejectWithValue }) => {
    try {
      const response = await axios.put<ApiResponse<UserToken>>(
        `${API_URL}/rooms/${id}/extend-tenancy`, 
        { rentEndDate },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const assignDateTenancyTenure = createAsyncThunk<UserToken, TenancyRequest>(
  "tenancy/assign-date",
  async ({ id, rentEndDate, rentStartDate }: TenancyRequest, { rejectWithValue }) => {
    try {
      const response = await axios.put<ApiResponse<UserToken>>(
        `${API_URL}/rooms/${id}/assign-tenancy-date`, 
        { rentEndDate, rentStartDate },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Create user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserToken: (state) => {
      state.data = null;
      state.loading = "idle";
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      // Verify account
      .addCase(verifyAccount.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(verifyAccount.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(verifyAccount.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      // Create user by landlord
      .addCase(createUserByLandlord.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(createUserByLandlord.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(createUserByLandlord.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      // Get tenants onboarded by landlord
      .addCase(getTenantsOnboardedByLandlord.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(getTenantsOnboardedByLandlord.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(getTenantsOnboardedByLandlord.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      // Verify email
      .addCase(verifyEmail.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      // End tenancy tenure
      .addCase(endTenancyTenure.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(endTenancyTenure.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(endTenancyTenure.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      // Extend tenancy tenure
      .addCase(extendTenancyTenure.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(extendTenancyTenure.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(extendTenancyTenure.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      // Assign date tenancy tenure
      .addCase(assignDateTenancyTenure.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(assignDateTenancyTenure.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(assignDateTenancyTenure.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { clearUserToken, clearError } = userSlice.actions;
export default userSlice.reducer;
