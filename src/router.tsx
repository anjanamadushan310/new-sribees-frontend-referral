/**
 * Partner Portal router.
 *
 * Deliberately tiny: a login page and a dashboard. This portal exists to keep
 * outside agents off the administration dashboard entirely, so it should never
 * grow routes that mirror admin functionality — anything an agent needs goes
 * behind /partner/* on the API, with its own authorization.
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TOKEN_KEY } from './api/client';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Presence of a token only decides what to render; the API is the actual
    // authority and rejects anything stale on the first request.
    if (!localStorage.getItem(TOKEN_KEY)) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

const AppRouter: React.FC = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
                element={
                    <RequireAuth>
                        <Dashboard />
                    </RequireAuth>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
);

export default AppRouter;
