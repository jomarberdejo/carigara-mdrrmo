import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from '../Admin/AdminLayout';
import Incidents from '../pages/Incidents';
import Users from '../pages/Users'
import Profile from '../pages/Profile'
import Incident from '../pages/Incident';
import SignInForm from '../auth/SignInForm'
import SignUpForm from '../auth/SignUpForm'
import Dashboard from '../pages/Dashboard';
import { useAuth } from '../context/AuthContext';
import User from '../pages/User';
import NotFound from '../pages/NotFound';
import Homepage from '../pages/Homepage';
import UserLayout from '../User/UserLayout';



const RouteLayout = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <Router>
      {isAuthenticated && user.role === "Admin" && (
     
          <AdminLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/users" element={<Users />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/incident/:id" element= {<Incident />}/>
              <Route path="/user/:id" element= {<User />}/>       
              <Route path="*" element= {<NotFound/>}/>
            </Routes>
          </AdminLayout>

      )} 
        {isAuthenticated && user.role === "User" && (
            
            <UserLayout>
              <Routes>
                <Route path="/" element={<Homepage />} /> 
                <Route path="/profile" element={<Profile />} />   
                <Route path="*" element= {<NotFound/>}/>
              </Routes>
            </UserLayout>

        )} 
      {!isAuthenticated && (

          <Routes>
            <Route path="/" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="*" element= {<NotFound/>}/>
          </Routes>

      )}
    </Router>
  );
};

export default RouteLayout;
