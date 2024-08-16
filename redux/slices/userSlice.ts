import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from '../../config/constant';


interface UserState {
    data: UserToken | null;
    loading: "idle" | "pending" | "succeeded" | "failed";
    error: string | null;
}

export interface UserToken {
    token: string
}

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    nin: string;
    password: string;
    phoneNumber: string;
    homeAddress: string;
    accountType: string;
}

interface LandlordUserToken {
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
interface verifyData {
    confirmationCode: string;
    email: string;
}

interface loginData {
    password: string;
    email: string;
}
// Define the initia l state
const initialState: UserState = {
    data: null,
    loading: "idle",
    error: null,
};

// Async thunk to fetch user data
export const createUser = createAsyncThunk<UserToken, FormData, {}>(
    "user/create",
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response: any = await axios.post(`${API_URL}/users`, formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            localStorage.setItem("emailToVerify", JSON.stringify(response?.data))
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

export const updateUser = createAsyncThunk<UserToken, FormData, {}>(
    "user/update",
    async (formData: any, { rejectWithValue }) => {
        const { id, payload } = formData;
        try {
            const response: any = await axios.put(`${API_URL}/users/${id}`, payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
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

// Async thunk to verify user
export const verifyAccount = createAsyncThunk<UserToken, verifyData, {}>(
    "user/verify",
    async (verifyData: verifyData, { rejectWithValue }) => {
        try {
            const response: any = await axios.post(`${API_URL}/users/confirm-account`, verifyData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            localStorage.setItem("nrv-user", JSON.stringify(response?.data))
            // localStorage.removeItem("emailToVerify");
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

// Async thunk to login user
export const loginUser = createAsyncThunk<UserToken, loginData, {}>(
    "user/login",
    async (loginData: loginData, { rejectWithValue }) => {
        try {
            const response: any = await axios.post(`${API_URL}/auth/login`, loginData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            localStorage.setItem("nrv-user", JSON.stringify(response?.data))
            localStorage.removeItem("emailToVerify");
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

export const createUserByLandlord = createAsyncThunk<UserToken, LandlordUserToken, {}>(
    "user/create/landlord",
    async (formData: LandlordUserToken, { rejectWithValue }) => {
        try {
            const response: any = await axios.post(`${API_URL}/users/landlord`, formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
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

export const getTenantsOnboardedByLandlord = createAsyncThunk<any, {}>(
    "onboarded-by-landlord/get",
    async (formData: any, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/properties/tenent/landlord-onboarded?id=${formData.id}`);
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
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserToken: (state) => {
            state.data = null;
            state.loading = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
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
            }).addCase(getTenantsOnboardedByLandlord.pending, (state) => {
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
            });
    },
});

// Export actions and reducer
export const { clearUserToken } = userSlice.actions;
export default userSlice.reducer;
