import { DangerRight, Success } from "@/api/toastServices";
import { apiInstanceFetch } from "@/utils/ApiInstance";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface UserState {
    content: any[];
    total: number;
    isLoading: boolean;
    isSkeleton: boolean;
}

const initialState: UserState = {
    content: [],
    total: 0,
    isLoading: false,
    isSkeleton: false,
};

interface AllUsersPayload {
    start?: number;
    limit?: number;
    search: string;
    startDate?: string;
    endDate?: string;
    type?: string;
    meta: any;
    id?: string;
    data?: any;
    formData?: any;
    payload?: any;
}

export const getContent: any = createAsyncThunk(
    "admin/contentPage/content",
    async (payload: any) => {
        return apiInstanceFetch.get(
            `admin/contentPage/content`
        );
    }
);

export const deleteContent: any = createAsyncThunk(
    "admin/contentPage/content4",
    async (payload: AllUsersPayload | undefined, { rejectWithValue }) => {
      try {
        const response = await  axios.delete(`admin/contentPage/content?contentId=${payload}`);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data || { message: "Something went wrong" }
        );
      }
    }
  );

export const createContent: any = createAsyncThunk(
    "admin/contentPage/content2",
    async (payload: AllUsersPayload | undefined, { rejectWithValue }) => {
      try {
        const response = await axios.post(`admin/contentPage/content`, payload);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data || { message: "Something went wrong" }
        );
      }
    }
  );

  
  

export const updateContent: any = createAsyncThunk(
    "admin/contentPage/content3",
    async (payload: any) => {
        return axios.patch(`admin/contentPage/content?contentId=${payload?.contentId}`, payload?.data);
    }
);

const contentSlice = createSlice({
    name: "content",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getContent.pending, (state, action: PayloadAction<any>) => {
            state.isSkeleton = true;
        });

        builder.addCase(
            getContent.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.isSkeleton = false;
                state.content = action.payload.data;
            }
        );
        builder.addCase(getContent.rejected, (state) => {
            state.isSkeleton = false;
        });

        builder.addCase(createContent.pending, (state, action: PayloadAction<any>) => {
            state.isLoading = true;
        });

        builder
        .addCase(createContent.fulfilled, (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          if (action.payload.status) {
            state.content.unshift(action.payload.data);
            Success("Content Add Successfully");
          } else {
            DangerRight(action.payload.message || "Something went wrong");
          }
        })
        .addCase(createContent.rejected, (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          DangerRight(action.payload?.message || "Request failed");
        });
      


        builder.addCase(
            deleteContent.pending,
            (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            }
        );

        builder.addCase(
            deleteContent.fulfilled,
            (state, action: any) => {
                if (action?.payload?.status) {

                    state.content = state.content.filter(
                        (content) => content?._id !== action?.meta?.arg
                    );
                    state.total -= 1;
                    Success("content Delete Successfully");
                } else {
                    DangerRight(action.payload.message || "Something went wrong");
                  }
                state.isLoading = false;
            }
        );

        builder.addCase(deleteContent.rejected, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(
              updateContent.pending,
              (state, action: PayloadAction<any>) => {
                state.isLoading = true;
              }
            );
        
            builder.addCase(
              updateContent.fulfilled,
              (state, action: PayloadAction<any>) => {
                  if (action.payload.status) {
                    
                    const contentIndex = state.content.findIndex(
                      (content) => content?._id === action?.payload?.data?.data?._id
                    );
                    
                    if (contentIndex !== -1) {
        
                      state.content[contentIndex] = {
                        ...state.content[contentIndex],
                        ...action.payload.data.data,
                      };
                    } else {
                        DangerRight(action.payload.message || "Something went wrong");
                      }
                  }
                  Success("Content Update Successfully");
                state.isLoading = false;
              }
            );
        
            builder.addCase(updateContent.rejected, (state, action) => {
              state.isLoading = false;
            });

    },
});

export default contentSlice.reducer;
