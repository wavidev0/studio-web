import {  apiInstanceFetch } from "@/utils/ApiInstance";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface SuggestionState {
  recharge: [];
  total?: number;
  isLoading: boolean;
}

const initialState: SuggestionState = {
  recharge: [],
  total: 0,
  isLoading: false,
};

interface AllUsersPayload {
  startDate?: any;
  endDate?: any;
  status?: any;
}

export const getRechargeRequest = createAsyncThunk(
  "admin/userWallet/getRechargeHistory",
  async (payload: AllUsersPayload | undefined) => {
    return await apiInstanceFetch.get(
      `admin/userWallet/getRechargeHistory?startDate=${payload?.startDate}&endDate=${payload?.endDate}&type=${payload?.status}`
    );
  }
);

const rechargeSlice = createSlice({
  name: "withdrawal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getRechargeRequest.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      getRechargeRequest.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.recharge = action.payload.data;
        state.total = action.payload.total;
      }
    );
  },
});

export default rechargeSlice.reducer;
