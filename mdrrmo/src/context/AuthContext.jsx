import React, { createContext, useContext, useState, useLayoutEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; 

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthContextWrapper = ({ children }) => {
 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);

  useLayoutEffect(() => {
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      const currentTime = Date.now() / 1000; 
      // console.log(decodedToken)
      // console.log(currentTime)
     
      if (decodedToken.exp < currentTime) { 
        logoutUser();
        alert("Login session has expired, Login with your account again to continue.") 
        
      } else {
        setIsAuthenticated(true);
        setToken(storedToken);
        setUserData(JSON.parse(localStorage.getItem('user')));
      }
    }
  }, []); 

  const loginUser = (userInfo, authToken) => {
    setIsAuthenticated(true);
    setUserData(userInfo);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userInfo));
    localStorage.setItem('token', authToken);
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    setUserData(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const values = {
    isAuthenticated,
    loginUser,
    logoutUser,
    user: userData,
    setUserData,
    token,
  };
  
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContextWrapper;
