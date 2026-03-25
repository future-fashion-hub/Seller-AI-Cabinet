import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ItemWithRevision, ItemsGetOut } from '../types';
import { ItemsAPI } from '../services/api';

interface AdsState {
  list: ItemWithRevision[];
  total: number;
  loading: boolean;
  error: string | null;

  currentItem: ItemWithRevision | null;
  currentItemLoading: boolean;
  currentItemError: string | null;
}

const initialState: AdsState = {
  list: [],
  total: 0,
  loading: false,
  error: null,
  
  currentItem: null,
  currentItemLoading: false,
  currentItemError: null,
};

export const fetchAds = createAsyncThunk<ItemsGetOut, Record<string, string | number | boolean>>(
  'ads/fetchAds',
  async (params, thunkApi) => {
    return await ItemsAPI.getItems(params, thunkApi.signal);
  }
);

export const fetchAdById = createAsyncThunk<ItemWithRevision, string>(
  'ads/fetchAdById',
  async (id, thunkApi) => {
    return await ItemsAPI.getItemById(id, thunkApi.signal);
  }
);

const adsSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    clearCurrentItem(state) {
      state.currentItem = null;
      state.currentItemError = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchAds.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAds.fulfilled, (state, action: PayloadAction<ItemsGetOut>) => {
      state.loading = false;
      state.list = action.payload.items;
      state.total = action.payload.total;
    });
    builder.addCase(fetchAds.rejected, (state, action) => {
      state.loading = false;
      if (action.meta.aborted) {
        return;
      }
      state.error = action.error.message || 'Failed to fetch ads';
    });

    builder.addCase(fetchAdById.pending, (state) => {
      state.currentItemLoading = true;
      state.currentItemError = null;
    });
    builder.addCase(fetchAdById.fulfilled, (state, action: PayloadAction<ItemWithRevision>) => {
      state.currentItemLoading = false;
      state.currentItem = action.payload;
    });
    builder.addCase(fetchAdById.rejected, (state, action) => {
      state.currentItemLoading = false;
      if (action.meta.aborted) {
        return;
      }
      state.currentItemError = action.error.message || 'Failed to fetch the ad details';
    });
  },
});

export const { clearCurrentItem } = adsSlice.actions;
export default adsSlice.reducer;
