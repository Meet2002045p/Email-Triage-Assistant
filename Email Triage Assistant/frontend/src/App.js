import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { EmailProvider } from './context/EmailContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <EmailProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard/*" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </EmailProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
