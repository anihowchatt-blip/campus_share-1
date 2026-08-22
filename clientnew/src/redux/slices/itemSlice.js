import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { addToast } from './uiSlice';

// 1. Fetch Categories
export const fetchCategories = createAsyncThunk(
  'items/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/categories');
      return response.data?.categories || [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch categories');
    }
  }
);

// 2. Fetch Marketplace Items
export const fetchMarketplaceItems = createAsyncThunk(
  'items/fetchMarketplaceItems',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] !== undefined && queryParams[key] !== '' && queryParams[key] !== null) {
          params.append(key, queryParams[key]);
        }
      });
      const response = await api.get(`/items?${params.toString()}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch marketplace items');
    }
  }
);

// 3. Fetch Single Item Details
export const fetchItemDetails = createAsyncThunk(
  'items/fetchItemDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data?.item;
    } catch (err) {
      return rejectWithValue(err.message || 'Item not found');
    }
  }
);

// 4. Create Item Listing
export const createListing = createAsyncThunk(
  'items/createListing',
  async (itemData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/items', itemData);
      dispatch(
        addToast({
          type: 'success',
          title: 'Listing Published!',
          message: 'Your item is now live on your campus marketplace.',
        })
      );
      return response.data?.item;
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Failed to Publish',
          message: err.message || 'Could not publish listing',
        })
      );
      return rejectWithValue(err);
    }
  }
);

// 5. Update Listing
export const updateListing = createAsyncThunk(
  'items/updateListing',
  async ({ id, itemData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/items/${id}`, itemData);
      dispatch(
        addToast({
          type: 'success',
          title: 'Listing Updated',
          message: 'Your changes have been saved.',
        })
      );
      return response.data?.item;
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Update Failed',
          message: err.message || 'Failed to update listing',
        })
      );
      return rejectWithValue(err);
    }
  }
);

// 6. Delete Listing
export const deleteListing = createAsyncThunk(
  'items/deleteListing',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/items/${id}`);
      dispatch(
        addToast({
          type: 'info',
          title: 'Listing Deleted',
          message: 'The item has been removed from the marketplace.',
        })
      );
      return id;
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Delete Failed',
          message: err.message || 'Failed to delete listing',
        })
      );
      return rejectWithValue(err);
    }
  }
);

const initialState = {
  items: [],
  categories: [],
  selectedItem: null,
  pagination: {
    page: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    search: '',
    category: 'all',
    department: 'all',
    semester: 'all',
    condition: 'all',
    minPrice: '',
    maxPrice: '',
    isNegotiable: '',
    college: 'all',
    sort: 'newest',
  },
  isLoading: false,
  isDetailLoading: false,
  isCreating: false,
  error: null,
};

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCategories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // fetchMarketplaceItems
      .addCase(fetchMarketplaceItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMarketplaceItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload?.items || [];
        state.pagination = action.payload?.pagination || state.pagination;
      })
      .addCase(fetchMarketplaceItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchItemDetails
      .addCase(fetchItemDetails.pending, (state) => {
        state.isDetailLoading = true;
        state.selectedItem = null;
      })
      .addCase(fetchItemDetails.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchItemDetails.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.error = action.payload;
      })
      // createListing
      .addCase(createListing.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.isCreating = false;
        state.items.unshift(action.payload);
      })
      .addCase(createListing.rejected, (state) => {
        state.isCreating = false;
      })
      // deleteListing
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload && item.id !== action.payload);
      });
  },
});

export const { setFilter, resetFilters, clearSelectedItem } = itemSlice.actions;

export default itemSlice.reducer;
