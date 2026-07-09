/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { FeedView } from './components/FeedView';
import { ProfileView } from './components/ProfileView';
import { ChatView } from './components/ChatView';
import { WalletView } from './components/WalletView';
import { RankingsView } from './components/RankingsView';
import { VipView } from './components/VipView';
import { AdminDashboard } from './components/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EditProfilePage from './pages/EditProfilePage';
import { ShieldCheck, CheckCircle, AlertTriangle } from 'lucide-react';
import { isSupabaseConfigured } from './lib/supabase';

// Wrapper for protected routes
function ProtectedRoute() {
  const { currentUser, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// Wrapper for admin only routes
function AdminRoute() {
  const { currentUser, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

// Shell layout containing Navbar, Sidebar and Footer
function DashboardLayout() {
  const { currentUser } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col font-sans text-zinc-200 selection:bg-violet-600/30">
      
      {/* Navigation Top Header */}
      <Navbar 
        onOpenAuth={() => navigate('/login')} 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />

      {/* Supabase configuration status banner */}
      {!isSupabaseConfigured && (
        <div className="bg-amber-950/20 border-b border-amber-900/30 px-4 py-2.5 text-center text-xs text-amber-400 font-medium flex items-center justify-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 animate-pulse" />
          <span>
            <strong>Supabase Setup Incomplete:</strong> Please configure <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in environment variables.
          </span>
        </div>
      )}

      {/* Main split dashboard layout */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto relative">
        
        {/* Navigation Sidebar Pane */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          onOpenAuth={() => navigate('/register')}
        />

        {/* View stage wrapper */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 overflow-x-hidden min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>

      {/* Persistent global footer credits */}
      <footer className="border-t border-zinc-900 bg-zinc-950/40 py-6 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ConnectX Corporation. All simulated digital assets encrypted via AES-256 protocols.</p>
          <div className="flex items-center gap-4 text-[10px] text-zinc-600 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-violet-500" />
              Supabase Authenticated
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
              Live Gateway Active
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Publicly visible routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<FeedView />} />
        <Route path="/feed" element={<FeedView />} />
        <Route path="/rankings" element={<RankingsView />} />
        
        {/* Protected general routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/profile/:profileUserId" element={<ProfileView />} />
          <Route path="/chat" element={<ChatView />} />
          <Route path="/wallet" element={<WalletView />} />
          <Route path="/vip" element={<VipView />} />
        </Route>

        {/* Protected admin only routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* Auth pages (Full screen layout without Navbar/Sidebar) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Fallback to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
