import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../config/constant";

interface Plan {
  _id: string;
  slug: string;
  name: string;
  description: string;
  verificationTier: "standard" | "premium";
  propertyLimit: number;
  verificationLimit?: number;
  /** Credits added per purchased unit (1 = per-credit billing). */
  standardVerificationAdded?: number;
  premiumVerificationAdded?: number;
  /** Naira per credit (quantity × this = amount sent to Paystack). */
  unitPriceNaira?: number;
  features: string[];
  isActive: boolean;
}

interface PlansState {
  plans: Plan[];
  currentPlan: Plan | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PlansState = {
  plans: [],
  currentPlan: null,
  loading: "idle",
  error: null,
};

export const fetchPlans = createAsyncThunk(
  "plans/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/plans`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch plans"
      );
    }
  }
);

export const fetchDefaultPlan = createAsyncThunk(
  "plans/fetchDefault",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/plans/default`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch default plan"
      );
    }
  }
);

export const fetchPlanBySlug = createAsyncThunk(
  "plans/fetchBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/plans/${slug}`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch plan"
      );
    }
  }
);

const plansSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all plans
      .addCase(fetchPlans.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      // Fetch default plan
      .addCase(fetchDefaultPlan.fulfilled, (state, action) => {
        // Optionally store default plan separately if needed
      })
      // Fetch plan by slug
      .addCase(fetchPlanBySlug.fulfilled, (state, action) => {
        state.currentPlan = action.payload;
      });
  },
});

export default plansSlice.reducer;
