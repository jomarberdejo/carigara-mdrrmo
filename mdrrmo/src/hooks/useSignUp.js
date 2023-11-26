import { useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const useSignUp = () => {

  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const ageRef = useRef(null);
  const contactRef = useRef(null)
  const locationRef = useRef(null);
  
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null)
  const roleRef = useRef('User')

  const handleSignUp = async () => {
    try {
      const userInfo = {
        firstname: firstNameRef.current.value,
        lastname: lastNameRef.current.value,
        age: ageRef.current.value,
        contact: contactRef.current.value,
        location: locationRef.current.value,
        email: emailRef.current.value,   
        password: passwordRef.current.value,
        confirmPassword: confirmPasswordRef.current.value,
        role: roleRef.current,
      };

      console.log(userInfo);

      const result = await axios.post('https://mdrrmoserver.onrender.com/api/auth/signup', userInfo);
      const data = await result.data;

      loginUser(data?.user, data?.token);

      navigate('/');
      return data;
    } catch (error) {
     
      throw error; 
    }
  };

  return {
    firstNameRef,
    lastNameRef,
    ageRef,
    contactRef,
    locationRef,
    emailRef,
    passwordRef,
    confirmPasswordRef,
    handleSignUp,
   }
};

export default useSignUp;
