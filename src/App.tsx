import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import Home from './pages/Home';
import MotorcycleDetail from './pages/MotorcycleDetail';
import BrandDetail from './pages/BrandDetail';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminMotorcycles from './pages/admin/AdminMotorcycles';
import AdminBrands from './pages/admin/AdminBrands';
import AdminManuals from './pages/admin/AdminManuals';
import AdminUsers from './pages/admin/AdminUsers';
import ManualDetail from './pages/ManualDetail';
import { useAuth } from './context/auth';
import AdminMotorcycleGridPage from "./pages/admin/AdminMotorcycleGrid";

function App() {
  const [supabaseClient] = useState(() => useSupabaseClient());
  const session = useSession();
  const { isAdminVerified } = useAuth();

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={session}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/motorcycles/:slug" element={<MotorcycleDetail />} />
          <Route path="/brands/:slug" element={<BrandDetail />} />
          <Route path="/manuals/:id" element={<ManualDetail />} />
          <Route
            path="/auth"
            element={
              <AuthPage
                supabaseClient={supabaseClient}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'github']}
                redirectTo={`${window.location.origin}/account`}
              />
            }
          />
          <Route
            path="/account"
            element={
              session ? (
                <AccountPage supabaseClient={supabaseClient} />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />

          {/* Admin Routes - only accessible if isAdminVerified is true */}
          <Route
            path="/admin"
            element={
              isAdminVerified ? (
                <AdminLayout />
              ) : (
                <Navigate to="/" replace />
              )
            }
          >
            <Route path="/admin/motorcycles" element={<AdminMotorcycles />} />
            <Route path="/admin/brands" element={<AdminBrands />} />
            <Route path="/admin/manuals" element={<AdminManuals />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            {
              path: "/admin/motorcycles/grid",
              element: <AdminMotorcycleGridPage />,
            },
          </Route>
        </Routes>
      </Router>
    </SessionContextProvider>
  );
}

export default App;
