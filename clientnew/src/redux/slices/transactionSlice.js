import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { addToast } from './uiSlice';

// 1. Fetch Seller Dashboard Data
export const fetchSellerDashboard = createAsyncThunk(
  'transactions/fetchSellerDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/transactions/seller-dashboard');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load seller dashboard');
    }
  }
);

// 2. Mark Item as Sold
export const markItemAsSoldThunk = createAsyncThunk(
  'transactions/markItemAsSold',
  async (transactionData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/transactions/mark-sold', transactionData);
      dispatch(
        addToast({
          type: 'success',
          title: 'Marked as Sold!',
          message: 'Campus exchange recorded. Your seller statistics have been updated.',
        })
      );
      return response.data?.transaction;
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Failed to Complete',
          message: err.message || 'Could not mark item as sold',
        })
      );
      return rejectWithValue(err);
    }
  }
);

// 3. Submit Seller Review & Rating
export const submitSellerReview = createAsyncThunk(
  'transactions/submitSellerReview',
  async (reviewData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/reviews', reviewData);
      dispatch(
        addToast({
          type: 'success',
          title: 'Review Published!',
          message: 'Thank you for keeping our campus community transparent and trustworthy.',
        })
      );
      return response.data;
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Review Failed',
          message: err.message || 'Could not submit review',
        })
      );
      return rejectWithValue(err);
    }
  }
);

// 4. Fetch Seller Reviews
export const fetchSellerReviews = createAsyncThunk(
  'transactions/fetchSellerReviews',
  async (sellerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reviews/seller/${sellerId}`);
      return response.data?.reviews || [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch reviews');
    }
  }
);

// 5. Fetch Transaction History
export const fetchTransactionHistory = createAsyncThunk(
  'transactions/fetchTransactionHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/transactions/history');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch transaction history');
    }
  }
);

const initialState = {
  metrics: {
    totalListed: 0,
    totalSold: 0,
    activeListings: 0,
    totalEarnings: 0,
    rating: 5.0,
    totalRatings: 0,
  },
  myListings: [],
  recentTransactions: [],
  sellerReviews: [],
  purchaseHistory: [],
  salesHistory: [],
  isLoading: false,
  isActionLoading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchSellerDashboard
      .addCase(fetchSellerDashboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSellerDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metrics = action.payload?.metrics || state.metrics;
        state.myListings = action.payload?.myListings || [];
        state.recentTransactions = action.payload?.recentTransactions || [];
      })
      .addCase(fetchSellerDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // markItemAsSoldThunk
      .addCase(markItemAsSoldThunk.pending, (state) => {
        state.isActionLoading = true;
      })
      .addCase(markItemAsSoldThunk.fulfilled, (state, action) => {
        state.isActionLoading = false;
        const tx = action.payload;
        if (tx && tx.item) {
          const itemIndex = state.myListings.findIndex((i) => i._id === (tx.item._id || tx.item));
          if (itemIndex !== -1) {
            state.myListings[itemIndex].status = 'sold';
          }
          state.metrics.totalSold += 1;
          state.metrics.activeListings = Math.max(0, state.metrics.activeListings - 1);
          state.metrics.totalEarnings += tx.agreedPrice || 0;
          state.recentTransactions.unshift(tx);
        }
      })
      .addCase(markItemAsSoldThunk.rejected, (state) => {
        state.isActionLoading = false;
      })
      // fetchSellerReviews
      .addCase(fetchSellerReviews.fulfilled, (state, action) => {
        state.sellerReviews = action.payload;
      })
      // fetchTransactionHistory
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.salesHistory = action.payload?.sales || [];
        state.purchaseHistory = action.payload?.purchases || [];
      });
  },
});

export default transactionSlice.reducer;
