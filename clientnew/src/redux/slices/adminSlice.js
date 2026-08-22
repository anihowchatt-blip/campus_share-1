import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { addToast } from './uiSlice';

// 1. Fetch Admin Overview Stats
export const fetchAdminOverview = createAsyncThunk(
  'admin/fetchAdminOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/overview');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch admin overview');
    }
  }
);

// 2. Fetch Users
export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchAdminUsers',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.keys(queryParams).forEach((k) => {
        if (queryParams[k] !== undefined && queryParams[k] !== '') {
          params.append(k, queryParams[k]);
        }
      });
      const response = await api.get(`/admin/users?${params.toString()}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch users');
    }
  }
);

// 3. Toggle User Ban
export const toggleUserBanThunk = createAsyncThunk(
  'admin/toggleUserBan',
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/users/${userId}/ban`);
      dispatch(
        addToast({
          type: 'info',
          title: 'User Status Updated',
          message: response.message || 'User status updated',
        })
      );
      return response.data?.user;
    } catch (err) {
      dispatch(addToast({ type: 'error', title: 'Error', message: err.message }));
      return rejectWithValue(err);
    }
  }
);

// 4. Manually Verify User
export const manuallyVerifyUserThunk = createAsyncThunk(
  'admin/manuallyVerifyUser',
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/users/${userId}/verify`);
      dispatch(
        addToast({
          type: 'success',
          title: 'Account Verified',
          message: 'Student account has been verified manually.',
        })
      );
      return response.data?.user;
    } catch (err) {
      dispatch(addToast({ type: 'error', title: 'Error', message: err.message }));
      return rejectWithValue(err);
    }
  }
);

// 5. Fetch Items for Moderation
export const fetchAdminItems = createAsyncThunk(
  'admin/fetchAdminItems',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.keys(queryParams).forEach((k) => {
        if (queryParams[k] !== undefined && queryParams[k] !== '') {
          params.append(k, queryParams[k]);
        }
      });
      const response = await api.get(`/admin/items?${params.toString()}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch items');
    }
  }
);

// 6. Moderate Item (Approve / Reject)
export const moderateItemThunk = createAsyncThunk(
  'admin/moderateItem',
  async ({ itemId, status }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/items/${itemId}/status`, { status });
      dispatch(
        addToast({
          type: 'success',
          title: 'Listing Moderated',
          message: `Listing status changed to ${status}.`,
        })
      );
      return response.data?.item;
    } catch (err) {
      dispatch(addToast({ type: 'error', title: 'Error', message: err.message }));
      return rejectWithValue(err);
    }
  }
);

// 7. Delete Item Admin
export const deleteItemAdminThunk = createAsyncThunk(
  'admin/deleteItemAdmin',
  async (itemId, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/admin/items/${itemId}`);
      dispatch(
        addToast({
          type: 'info',
          title: 'Listing Removed',
          message: 'Suspicious listing deleted by moderator.',
        })
      );
      return itemId;
    } catch (err) {
      dispatch(addToast({ type: 'error', title: 'Error', message: err.message }));
      return rejectWithValue(err);
    }
  }
);

// 8. Fetch Safety Reports
export const fetchSafetyReports = createAsyncThunk(
  'admin/fetchSafetyReports',
  async (status = 'all', { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/reports?status=${status}`);
      return response.data?.reports || [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch reports');
    }
  }
);

// 9. Resolve Safety Report
export const resolveReportThunk = createAsyncThunk(
  'admin/resolveReport',
  async ({ reportId, status, actionTaken }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/reports/${reportId}/resolve`, { status, actionTaken });
      dispatch(
        addToast({
          type: 'success',
          title: 'Report Resolved',
          message: `Action executed: ${actionTaken}.`,
        })
      );
      return response.data?.report;
    } catch (err) {
      dispatch(addToast({ type: 'error', title: 'Error', message: err.message }));
      return rejectWithValue(err);
    }
  }
);

// 10. Fetch Colleges
export const fetchAdminColleges = createAsyncThunk(
  'admin/fetchAdminColleges',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/colleges');
      return response.data?.colleges || [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load colleges');
    }
  }
);

// 11. Add College
export const addCollegeThunk = createAsyncThunk(
  'admin/addCollege',
  async (collegeData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/admin/colleges', collegeData);
      dispatch(
        addToast({
          type: 'success',
          title: 'University Registered',
          message: `${collegeData.name} has been added to approved colleges.`,
        })
      );
      return response.data?.college;
    } catch (err) {
      dispatch(addToast({ type: 'error', title: 'Error', message: err.message }));
      return rejectWithValue(err);
    }
  }
);

const initialState = {
  metrics: {
    totalUsers: 0,
    verifiedStudents: 0,
    totalItems: 0,
    activeListings: 0,
    totalTransactions: 0,
    grossVolume: 0,
    pendingReports: 0,
    totalColleges: 0,
  },
  categoryStats: [],
  recentUsers: [],
  recentItems: [],
  usersList: [],
  itemsList: [],
  reportsList: [],
  collegesList: [],
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAdminOverview
      .addCase(fetchAdminOverview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metrics = action.payload?.metrics || state.metrics;
        state.categoryStats = action.payload?.categoryStats || [];
        state.recentUsers = action.payload?.recentUsers || [];
        state.recentItems = action.payload?.recentItems || [];
      })
      .addCase(fetchAdminOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchAdminUsers
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.usersList = action.payload?.users || [];
      })
      // toggleUserBanThunk
      .addCase(toggleUserBanThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated) {
          const idx = state.usersList.findIndex((u) => u._id === updated._id);
          if (idx !== -1) state.usersList[idx] = updated;
        }
      })
      // manuallyVerifyUserThunk
      .addCase(manuallyVerifyUserThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated) {
          const idx = state.usersList.findIndex((u) => u._id === updated._id);
          if (idx !== -1) state.usersList[idx] = updated;
        }
      })
      // fetchAdminItems
      .addCase(fetchAdminItems.fulfilled, (state, action) => {
        state.itemsList = action.payload?.items || [];
      })
      // moderateItemThunk
      .addCase(moderateItemThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated) {
          const idx = state.itemsList.findIndex((i) => i._id === updated._id);
          if (idx !== -1) state.itemsList[idx] = updated;
        }
      })
      // deleteItemAdminThunk
      .addCase(deleteItemAdminThunk.fulfilled, (state, action) => {
        state.itemsList = state.itemsList.filter((i) => i._id !== action.payload);
      })
      // fetchSafetyReports
      .addCase(fetchSafetyReports.fulfilled, (state, action) => {
        state.reportsList = action.payload;
      })
      // resolveReportThunk
      .addCase(resolveReportThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated) {
          const idx = state.reportsList.findIndex((r) => r._id === updated._id);
          if (idx !== -1) state.reportsList[idx] = updated;
        }
      })
      // fetchAdminColleges
      .addCase(fetchAdminColleges.fulfilled, (state, action) => {
        state.collegesList = action.payload;
      })
      // addCollegeThunk
      .addCase(addCollegeThunk.fulfilled, (state, action) => {
        if (action.payload) state.collegesList.push(action.payload);
      });
  },
});

export default adminSlice.reducer;
