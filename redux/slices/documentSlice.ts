import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../config/constant";

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

export const uploadDocument = createAsyncThunk<any, {}>(
  "property/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/documents/upload-documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "An error occurred, please try again later";
      return rejectWithValue(message);
    }
  }
);

export const createUploadAgreement = createAsyncThunk<FormData, {}>(
  "upload/agreement",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/properties/upload-agreement-document`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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

//fetchUploadedDocuments

export const fetchUploadedDocuments = createAsyncThunk(
  "property/fetchUploadedDocuments",
  async (propertyId: string) => {
    const response = await axios.get(
      `${API_URL}/documents/${propertyId}`
    );
    const data = response?.data?.data;
    console.log({data});
    

    const files = [
      ...(data.file
        ? [
            {
              name: "Lease Agreement",
              url: data.file,
              category: "Tenant Lease Agreement",
            },
          ]
        : []),
      ...(Array.isArray(data.landlordInsurancePolicy)
        ? data.landlordInsurancePolicy.map((url: string, index: number) => ({
            name: `Insurance Document ${index + 1}`,
            url,
            category: "Landlord Insurance Policy",
          }))
        : []),
      ...(Array.isArray(data.utilityAndMaintenance)
        ? data.utilityAndMaintenance.map((url: string, index: number) => ({
            name: `Utility File ${index + 1}`,
            url,
            category: "Utility & Maintenance",
          }))
        : []),
      ...(Array.isArray(data.otherDocuments)
        ? data.otherDocuments.map((url: string, index: number) => ({
            name: `Other Document ${index + 1}`,
            url,
            category: "Other Documents",
          }))
        : []),
    ];
    console.log({files});
    

    return files;
  }
);

const documentSlice = createSlice({
  name: "document",
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

      .addCase(fetchUploadedDocuments.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchUploadedDocuments.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchUploadedDocuments.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearPropertyData } = documentSlice.actions;
export default documentSlice.reducer;
