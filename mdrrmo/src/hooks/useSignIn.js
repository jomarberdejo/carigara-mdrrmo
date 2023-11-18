import { useState, useRef } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

import { useAuth } from '../context/AuthContext';

const useSignIn = () => {
    const navigate = useNavigate()
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState(null);
  const { loginUser } = useAuth(); 

  const handleSignIn = async () => {
    try {
      const userInfo = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };

      const result = await axios.post('http://localhost:4000/api/auth/signin', userInfo);
      const data = await result.data;

      setError(null);
      loginUser(data.user, data.token); 
      
      navigate('/dashboard')

      return data;
    } catch (error) {
      throw error

    }
  };

  return { emailRef, passwordRef, handleSignIn };
};

export default useSignIn;
