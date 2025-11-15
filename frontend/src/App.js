import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TicketProvider } from './contexts/TicketContext';
import { Toaster } from './components/ui/sonner';
import CursorTracker from './components/CursorTracker';
import LoginPage from './pages/LoginPage';
import WorkspacePage from './pages/WorkspacePage';
import ReportsPage from './pages/ReportsPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066CC]"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <TicketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/workspace"
              element={
                <PrivateRoute>
                  <WorkspacePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <ReportsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/knowledge-base"
              element={
                <PrivateRoute>
                  <KnowledgeBasePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/workspace" />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
        <CursorTracker />
      </TicketProvider>
    </AuthProvider>
  );
}

export default App;
