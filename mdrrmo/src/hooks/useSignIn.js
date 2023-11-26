import { useState, useRef } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

import { useAuth } from '../context/AuthContext';

const useSignIn = () => {
    const navigate = useNavigate()
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const { loginUser } = useAuth(); 

  const handleSignIn = async () => {
    try {
      const userInfo = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };

      const result = await axios.post('https://mdrrmoserver.onrender.com/api/auth/signin', userInfo);
      const data = await result.data;

     
      loginUser(data.user, data.token); 
      
      navigate('/')

      return data;
    } catch (error) {
      throw error

    }
  };

  return { emailRef, passwordRef, handleSignIn };
};

export default useSignIn;
