import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { addToast } from './uiSlice';

// 1. Fetch Wishlist Items
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wishlist');
      return response.data?.wishlist || [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load wishlist');
    }
  }
);

// 2. Fetch Wishlist Item IDs for instant heart badges
export const fetchWishlistIds = createAsyncThunk(
  'wishlist/fetchWishlistIds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wishlist/ids');
      return response.data?.ids || [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load wishlist IDs');
    }
  }
);

// 3. Toggle Wishlist Item
export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggleWishlistItem',
  async (item, { dispatch, rejectWithValue }) => {
    try {
      const itemId = item._id || item.id;
      const response = await api.post('/wishlist/toggle', { itemId });
      const isWishlisted = response.data?.isWishlisted;

      dispatch(
        addToast({
          type: isWishlisted ? 'success' : 'info',
          title: isWishlisted ? 'Saved to Wishlist' : 'Removed from Wishlist',
          message: isWishlisted
            ? `"${item.title || 'Item'}" added to your saved bookmarks.`
            : `"${item.title || 'Item'}" removed from your wishlist.`,
          duration: 3000,
        })
      );

      return { itemId, isWishlisted, item };
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Wishlist Error',
          message: err.message || 'Please log in to save items to your wishlist.',
        })
      );
      return rejectWithValue(err);
    }
  }
);

// 4. Remove from Wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (itemId, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/wishlist/${itemId}`);
      dispatch(
        addToast({
          type: 'info',
          title: 'Removed',
          message: 'Item removed from your wishlist.',
        })
      );
      return itemId;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const initialState = {
  items: [],
  wishlistIds: [],
  isLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.wishlistIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchWishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.wishlistIds = action.payload.map((entry) => entry.item?._id || entry.item?.id);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchWishlistIds
      .addCase(fetchWishlistIds.fulfilled, (state, action) => {
        state.wishlistIds = action.payload;
      })
      // toggleWishlistItem
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        const { itemId, isWishlisted, item } = action.payload;
        if (isWishlisted) {
          if (!state.wishlistIds.includes(itemId)) {
            state.wishlistIds.push(itemId);
          }
          state.items.unshift({ item, savedAt: new Date().toISOString() });
        } else {
          state.wishlistIds = state.wishlistIds.filter((id) => id !== itemId);
          state.items = state.items.filter(
            (entry) => (entry.item?._id || entry.item?.id) !== itemId
          );
        }
      })
      // removeFromWishlist
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        const itemId = action.payload;
        state.wishlistIds = state.wishlistIds.filter((id) => id !== itemId);
        state.items = state.items.filter(
          (entry) => (entry.item?._id || entry.item?.id) !== itemId
        );
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
