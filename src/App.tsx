import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { AuthProvider } from './lib/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RequireAuth } from './lib/components/RequiredAuth';
import './App.css';
import '../node_modules/react-vis/dist/style.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="chi-main">
          <Routes>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
