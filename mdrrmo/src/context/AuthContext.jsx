import React, { createContext, useContext, useState } from 'react';


const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}

const AuthContextWrapper = ({ children }) => {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  

  const values = {
    isAuthenticated,
    setIsAuthenticated
  }

  return (

    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextWrapper;
