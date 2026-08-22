import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { addToast } from './uiSlice';

// 1. Fetch Notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch notifications');
    }
  }
);

// 2. Fetch Unread Count
export const fetchNotificationUnreadCount = createAsyncThunk(
  'notifications/fetchNotificationUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data?.unreadCount || 0;
    } catch (err) {
      return rejectWithValue(0);
    }
  }
);

// 3. Mark As Read
export const markNotificationRead = createAsyncThunk(
  'notifications/markNotificationRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data?.notification;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 4. Mark All As Read
export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllNotificationsRead',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.put('/notifications/read-all');
      dispatch(
        addToast({
          type: 'success',
          title: 'All Caught Up',
          message: 'All notifications marked as read.',
        })
      );
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 5. Delete Notification
export const deleteNotificationAction = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      return notificationId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 6. Fetch Campus Announcements
export const fetchCampusAnnouncements = createAsyncThunk(
  'notifications/fetchCampusAnnouncements',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/announcements');
      return response.data?.announcements || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  announcements: [],
  isLoading: false,
  isDrawerOpen: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    toggleNotificationDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    closeNotificationDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    addRealtimeNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchNotifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload?.notifications || [];
        state.unreadCount = action.payload?.unreadCount || 0;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchNotificationUnreadCount
      .addCase(fetchNotificationUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      // markNotificationRead
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notif = action.payload;
        if (notif) {
          const idx = state.notifications.findIndex((n) => n._id === notif._id);
          if (idx !== -1 && !state.notifications[idx].isRead) {
            state.notifications[idx].isRead = true;
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      })
      // markAllNotificationsRead
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.isRead = true;
        });
        state.unreadCount = 0;
      })
      // deleteNotificationAction
      .addCase(deleteNotificationAction.fulfilled, (state, action) => {
        const removed = state.notifications.find((n) => n._id === action.payload);
        if (removed && !removed.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter((n) => n._id !== action.payload);
      })
      // fetchCampusAnnouncements
      .addCase(fetchCampusAnnouncements.fulfilled, (state, action) => {
        state.announcements = action.payload;
      });
  },
});

export const { toggleNotificationDrawer, closeNotificationDrawer, addRealtimeNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
