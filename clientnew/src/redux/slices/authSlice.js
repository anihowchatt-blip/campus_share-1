import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { addToast } from './uiSlice';

// 1. Fetch current authenticated user
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      return response.data?.user || null;
    } catch (err) {
      return rejectWithValue(err.message || 'Not authenticated');
    }
  }
);

// 2. Register Student
export const registerStudent = createAsyncThunk(
  'auth/registerStudent',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', formData);
      dispatch(
        addToast({
          type: 'success',
          title: 'Account Created!',
          message: response.message || 'Please check your college email to verify your account.',
          duration: 6000,
        })
      );
      return response.data;
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Registration Failed',
          message: err.message || 'Unable to register.',
        })
      );
      return rejectWithValue(err);
    }
  }
);

// 3. Login Student
export const loginStudent = createAsyncThunk(
  'auth/loginStudent',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      dispatch(
        addToast({
          type: 'success',
          title: 'Welcome Back!',
          message: `Logged in as ${response.data?.user?.fullName || 'Student'}.`,
        })
      );
      return response.data?.user;
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Login Failed',
          message: err.message || 'Invalid credentials',
        })
      );
      return rejectWithValue(err);
    }
  }
);

// 4. Login With Google
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (googleData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/auth/google', googleData);
      dispatch(
        addToast({
          type: 'success',
          title: 'Google Sign-In Successful!',
          message: `Welcome, ${response.data?.user?.fullName || 'Student'}!`,
        })
      );
      return response.data?.user;
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Google Sign-In Failed',
          message: err.message || 'Could not authenticate with Google',
        })
      );
      return rejectWithValue(err);
    }
  }
);

// 5. Verify Email
export const verifyStudentEmail = createAsyncThunk(
  'auth/verifyStudentEmail',
  async (token, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-email', { token });
      dispatch(
        addToast({
          type: 'success',
          title: 'Email Verified!',
          message: 'Your student account is now active and verified.',
        })
      );
      return response.data?.user;
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Verification Failed',
          message: err.message || 'Token is invalid or expired.',
        })
      );
      return rejectWithValue(err);
    }
  }
);

// 6. Logout
export const logoutStudent = createAsyncThunk(
  'auth/logoutStudent',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      dispatch(
        addToast({
          type: 'info',
          title: 'Logged Out',
          message: 'You have been safely signed out.',
        })
      );
      return null;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 7. Update Profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put('/users/profile', profileData);
      dispatch(
        addToast({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile changes have been saved.',
        })
      );
      return response.data?.user;
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Update Failed',
          message: err.message || 'Could not update profile',
        })
      );
      return rejectWithValue(err);
    }
  }
);

// 8. Update Avatar
export const updateUserAvatar = createAsyncThunk(
  'auth/updateUserAvatar',
  async (avatarUrl, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/users/avatar', { avatar: avatarUrl });
      dispatch(
        addToast({
          type: 'success',
          title: 'Photo Updated',
          message: 'Your profile avatar has been updated.',
        })
      );
      return response.data?.avatar;
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Photo Update Failed',
          message: err.message || 'Could not update photo',
        })
      );
      return rejectWithValue(err);
    }
  }
);

// 9. Change Password
export const changeUserPassword = createAsyncThunk(
  'auth/changeUserPassword',
  async ({ currentPassword, newPassword }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put('/users/change-password', { currentPassword, newPassword });
      dispatch(
        addToast({
          type: 'success',
          title: 'Password Changed',
          message: 'Your password has been updated securely.',
        })
      );
      return response.data;
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Password Change Failed',
          message: err.message || 'Failed to update password',
        })
      );
      return rejectWithValue(err);
    }
  }
);

// 10. Delete Account
export const deleteUserAccount = createAsyncThunk(
  'auth/deleteUserAccount',
  async (password, { dispatch, rejectWithValue }) => {
    try {
      await api.delete('/users/account', { data: { password } });
      dispatch(
        addToast({
          type: 'info',
          title: 'Account Deleted',
          message: 'Your account has been deleted permanently.',
        })
      );
      return null;
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Deletion Failed',
          message: err.message || 'Incorrect password',
        })
      );
      return rejectWithValue(err);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isCheckingAuth = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCurrentUser
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.isCheckingAuth = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isCheckingAuth = false;
      })
      // registerStudent
      .addCase(registerStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerStudent.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      // loginStudent
      .addCase(loginStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      // loginWithGoogle
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Google login failed';
      })
      // verifyStudentEmail
      .addCase(verifyStudentEmail.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      // logoutStudent
      .addCase(logoutStudent.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      // updateUserProfile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })
      // updateUserAvatar
      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        if (state.user) state.user.avatar = action.payload;
      })
      // deleteUserAccount
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
