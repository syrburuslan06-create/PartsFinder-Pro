/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import MainLayout from './components/MainLayout';
import PublicLayout from './components/PublicLayout';
import SearchPage from './pages/SearchPage';
import LandingPage from './pages/LandingPage';
import RegisterRoleSelectionPage from './pages/RegisterRoleSelectionPage';
import RegisterOwnerPage from './pages/RegisterOwnerPage';
import RegisterMechanicPage from './pages/RegisterMechanicPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import OwnerAddWorkerPage from './pages/OwnerAddWorkerPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';
import SupportPage from './pages/SupportPage';
import SavedPartsPage from './pages/SavedPartsPage';
import UserHomePage from './pages/UserHomePage';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: 'owner' | 'mechanic' | 'admin';
}

function RoleProtectedRoute({ children, allowedRole }: RoleProtectedRouteProps) {
  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail');
  
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }
  
  // Super Admin check: only this specific email can access admin role
  if (allowedRole === 'admin') {
    if (userRole !== 'admin' || userEmail !== 'syrburuslan06@gmail.com') {
      return <Navigate to="/home" replace />;
    }
  } else if (userRole !== allowedRole && userRole !== 'admin') {
    // Admins can access everything, but others are restricted to their roles
    return <Navigate to={userRole === 'owner' ? "/owner/dashboard" : "/search"} replace />;
  }
  
  return <MainLayout>{children}</MainLayout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><RegisterRoleSelectionPage /></PublicLayout>} />
        <Route path="/register/owner" element={<PublicLayout><RegisterOwnerPage /></PublicLayout>} />
        <Route path="/register/mechanic" element={<PublicLayout><RegisterMechanicPage /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
        <Route path="/payment" element={<PublicLayout><PaymentPage /></PublicLayout>} />

        {/* Owner Only Routes */}
        <Route path="/owner/dashboard" element={<RoleProtectedRoute allowedRole="owner"><OwnerDashboardPage /></RoleProtectedRoute>} />
        <Route path="/owner/add-worker" element={<RoleProtectedRoute allowedRole="owner"><OwnerAddWorkerPage /></RoleProtectedRoute>} />

        {/* Admin Only Routes */}
        <Route path="/admin" element={<RoleProtectedRoute allowedRole="admin"><AdminDashboardPage /></RoleProtectedRoute>} />

        {/* Mechanic Only Routes */}
        <Route path="/search" element={<RoleProtectedRoute allowedRole="mechanic"><SearchPage /></RoleProtectedRoute>} />
        <Route path="/saved" element={<RoleProtectedRoute allowedRole="mechanic"><SavedPartsPage /></RoleProtectedRoute>} />

        {/* Shared Protected Routes */}
        <Route path="/home" element={<MainLayout><UserHomePage /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
        <Route path="/support" element={<MainLayout><SupportPage /></MainLayout>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
