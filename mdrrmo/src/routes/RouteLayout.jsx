import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react'; 

const AdminLayout = lazy(() => import('../Admin/AdminLayout'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Incidents = lazy(() => import('../pages/Incidents'));
const Users = lazy(() => import('../pages/Users'));
const Profile = lazy(() => import('../pages/Profile'));
const SigninForm = lazy(() => import('../auth/SigninForm'));
const SignupForm = lazy(() => import('../auth/SignupForm'));

import { useAuth } from '../context/AuthContext';

const RouteLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      {isAuthenticated ? (
        <Suspense fallback= {null}>
          <AdminLayout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/users" element={<Users />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </AdminLayout>
        </Suspense>
      ) : (
        <Suspense fallback= {null}>
          <Routes>
            <Route path="/" element={<SigninForm />} />
            <Route path="/signup" element={<SignupForm />} />
          </Routes>
        </Suspense>
      )}
    </Router>
  );
};

export default RouteLayout;
