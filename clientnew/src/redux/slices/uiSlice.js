import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('cs_theme') || 'light',
  isMobileMenuOpen: false,
  notificationCount: 3,
  toasts: [], // array of { id, type: 'success'|'error'|'info'|'warning', title, message, duration }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('cs_theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('cs_theme', action.payload);
    },
    setMobileMenuOpen: (state, action) => {
      state.isMobileMenuOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    addToast: (state, action) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      const toast = {
        id,
        type: action.payload.type || 'info',
        title: action.payload.title || '',
        message: action.payload.message || '',
        duration: action.payload.duration || 4000,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
    setNotificationCount: (state, action) => {
      state.notificationCount = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  setMobileMenuOpen,
  toggleMobileMenu,
  addToast,
  removeToast,
  clearAllToasts,
  setNotificationCount,
} = uiSlice.actions;

export default uiSlice.reducer;
