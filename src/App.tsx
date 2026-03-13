/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React from 'react';
import MainLayout from './components/MainLayout';
import PublicLayout from './components/PublicLayout';
import SearchPage from './pages/SearchPage';
import LandingPage from './pages/LandingPage';
import RegisterRoleSelectionPage from './pages/RegisterRoleSelectionPage';
import RegisterOwnerPage from './pages/RegisterOwnerPage';
import RegisterMechanicPage from './pages/RegisterMechanicPage';
import RegisterSupplierPage from './pages/RegisterSupplierPage';
import LoginPage from './pages/LoginPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';
import SavedPartsPage from './pages/SavedPartsPage';
import UserHomePage from './pages/UserHomePage';
import ResultsPage from './pages/ResultsPage';
import AlertsPage from './pages/AlertsPage';
import InventoryPage from './pages/InventoryPage';
import DashboardPage from './pages/DashboardPage';
import SupplierDashboardPage from './pages/SupplierDashboardPage';
import WorkersPage from './pages/WorkersPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';
import { AppProvider, useAppContext } from './contexts/AppContext';
import FloatingAIAssistant from './components/FloatingAIAssistant';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();
  
  if (!userRole) {
    return <Navigate to="/login" state={{ from: location, message: "Please log in to continue" }} replace />;
  }
  
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/home" replace />;
  }
  
  return <MainLayout>{children}</MainLayout>;
}

function SharedProtectedRoute({ children }: { children: React.ReactNode }) {
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();
  
  if (!userRole) {
    return <Navigate to="/login" state={{ from: location, message: "Please log in to continue" }} replace />;
  }
  
  return <MainLayout>{children}</MainLayout>;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><RegisterRoleSelectionPage /></PublicLayout>} />
          <Route path="/register/owner" element={<PublicLayout><RegisterOwnerPage /></PublicLayout>} />
          <Route path="/register/mechanic" element={<PublicLayout><RegisterMechanicPage /></PublicLayout>} />
          <Route path="/register/supplier" element={<PublicLayout><RegisterSupplierPage /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
          <Route path="/payment" element={<PublicLayout><PaymentPage /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />

          {/* Protected Routes */}
          <Route path="/owner/dashboard" element={<RoleProtectedRoute allowedRoles={['director', 'owner', 'super_admin']}><DashboardPage /></RoleProtectedRoute>} />
          <Route path="/supplier/dashboard" element={<RoleProtectedRoute allowedRoles={['supplier', 'super_admin']}><SupplierDashboardPage /></RoleProtectedRoute>} />
          <Route path="/search" element={<RoleProtectedRoute allowedRoles={['mechanic', 'super_admin']}><SearchPage /></RoleProtectedRoute>} />
          <Route path="/results" element={<RoleProtectedRoute allowedRoles={['mechanic', 'super_admin']}><ResultsPage /></RoleProtectedRoute>} />
          <Route path="/saved" element={<SharedProtectedRoute><SavedPartsPage /></SharedProtectedRoute>} />
          <Route path="/alerts" element={<SharedProtectedRoute><AlertsPage /></SharedProtectedRoute>} />
          <Route path="/inventory" element={<RoleProtectedRoute allowedRoles={['director', 'owner', 'super_admin']}><InventoryPage /></RoleProtectedRoute>} />
          <Route path="/profile" element={<SharedProtectedRoute><ProfilePage /></SharedProtectedRoute>} />
          <Route path="/home" element={<RoleProtectedRoute allowedRoles={['mechanic', 'super_admin']}><UserHomePage /></RoleProtectedRoute>} />

          {/* Director Only Routes */}
          <Route path="/workers" element={<RoleProtectedRoute allowedRoles={['director', 'owner', 'super_admin']}><WorkersPage /></RoleProtectedRoute>} />

          {/* Super Admin Only Routes */}
          <Route path="/admin" element={<RoleProtectedRoute allowedRoles={['super_admin']}><AdminDashboardPage /></RoleProtectedRoute>} />
          
          {/* Fallback */}
          <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
        </Routes>
        <FloatingAIAssistant />
      </BrowserRouter>
    </AppProvider>
  );
}
