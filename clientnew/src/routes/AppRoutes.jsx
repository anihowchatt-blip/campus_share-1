import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Profile Page
import ProfilePage from '../pages/profile/ProfilePage';

// Marketplace Pages
import BrowsePage from '../pages/marketplace/BrowsePage';
import ItemDetailsPage from '../pages/marketplace/ItemDetailsPage';
import SellItemPage from '../pages/marketplace/SellItemPage';
import CategoriesDirectoryPage from '../pages/categories/CategoriesDirectoryPage';
import CategoryDrilldownPage from '../pages/categories/CategoryDrilldownPage';
import WishlistPage from '../pages/marketplace/WishlistPage';

// Chat Page
import ChatPage from '../pages/chat/ChatPage';

// Seller Dashboard Page
import SellerDashboardPage from '../pages/dashboard/SellerDashboardPage';

// Admin Dashboard & Login Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';

// Notifications Page
import NotificationsPage from '../pages/notifications/NotificationsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Section 9.1: Unlisted Admin Login Entrypoint (Not in public nav) */}
      <Route path="admin/login" element={<AdminLoginPage />} />

      <Route path="/" element={<RootLayout />}>
        {/* Main Landing */}
        <Route index element={<HomePage />} />

        {/* Categories & Drilldown Navigation (Strict Order) */}
        <Route path="categories" element={<CategoriesDirectoryPage />} />
        <Route path="category/:slug" element={<CategoryDrilldownPage />} />

        {/* Marketplace Routes */}
        <Route path="browse" element={<BrowsePage />} />
        <Route path="item/:id" element={<ItemDetailsPage />} />
        <Route
          path="sell"
          element={
            <ProtectedRoute>
              <SellItemPage />
            </ProtectedRoute>
          }
        />

        {/* Wishlist Routes */}
        <Route
          path="wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />

        {/* Real-time Chat Routes */}
        <Route
          path="chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/messages"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* Notifications Route */}
        <Route
          path="notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* Seller Dashboard & Transaction Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <SellerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/listings"
          element={
            <ProtectedRoute>
              <SellerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/sales"
          element={
            <ProtectedRoute>
              <SellerDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Section 9.1: Admin Dashboard & Governance Route (Strict Server & Client Guard) */}
        <Route
          path="admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Authentication Routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />

        {/* Protected Profile Route */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Fallback & Info Routes */}
        <Route path="how-it-works" element={<HomePage />} />
        <Route path="about" element={<HomePage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
