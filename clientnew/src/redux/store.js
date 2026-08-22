import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import itemReducer from './slices/itemSlice';
import wishlistReducer from './slices/wishlistSlice';
import chatReducer from './slices/chatSlice';
import transactionReducer from './slices/transactionSlice';
import adminReducer from './slices/adminSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    items: itemReducer,
    wishlist: wishlistReducer,
    chat: chatReducer,
    transactions: transactionReducer,
    admin: adminReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
