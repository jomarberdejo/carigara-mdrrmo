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
import axios from 'axios';
import {  useQuery } from '@tanstack/react-query';
import Events from '../pages/Events';
import EventList from '../components/event/EventList';



const RouteLayout = () => {
  const { isAuthenticated, user, token } = useAuth();

  // const fetchUser = async() => {
  //   const response = await axios.get(`https://mdrrmoserver.onrender.com/api/users/${user.user_id}`,
  //   {
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //     }
  //    }
  //    )
  //   const data = await response.data[0]
  
  //   return data
  // }
  
  // const {data, isLoading} = useQuery({
  //   queryKey: ['singleUser', user?.user_id],
  //   queryFn: fetchUser,
  //   refetchOnWindowFocus: false,
  // })
  
  // if (isLoading){
  //   return null
  // }

  
  return (
    <Router>
      {isAuthenticated && user?.role === "Admin" && (
     
          <AdminLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/users" element={<Users />} />
              <Route path='/events' element= {<Events/>}/>
              <Route path="/profile" element={<Profile />} />
              <Route path="/incident/:id" element= {<Incident />}/>
              <Route path="/user/:id" element= {<User />}/>       
              <Route path="*" element= {<NotFound/>}/>
            </Routes>
          </AdminLayout>

      )} 
        {isAuthenticated && user?.role === "User" && (
            
            <UserLayout>
              <Routes>
                <Route path="/" element={<Homepage />} /> 
                <Route path="/profile" element={<Profile />} />   
                <Route path='/eventlist' element= {<EventList/>}/>
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
