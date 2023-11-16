import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminLayout from '../Admin/AdminLayout';
import Incidents from '../pages/Incidents';
import Users from '../pages/Users'
import Profile from '../pages/Profile'
import Incident from '../pages/Incident';
import SignInForm from '../auth/SignInForm'
import SignUpForm from '../auth/SignUpForm'
import Dashboard from '../pages/Dashboard';
import { useAuth } from '../context/AuthContext';



const RouteLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      {isAuthenticated && (
     
          <AdminLayout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/users" element={<Users />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/incident/:id" element= {<Incident />}/>
              <Route path="/*" element= {<div>Not Found</div>}/>
             
            </Routes>
          </AdminLayout>

      )} 
      {!isAuthenticated && (

          <Routes>
            <Route path="/" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="*" element= {<div>Not Found</div>}/>
          </Routes>

      )}
    </Router>
  );
};

export default RouteLayout;
