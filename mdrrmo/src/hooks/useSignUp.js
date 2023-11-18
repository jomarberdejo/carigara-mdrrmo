import { useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const useSignUp = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const ageRef = useRef(null);
  const locationRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSignUp = async () => {
    try {
      const userInfo = {
        firstname: firstNameRef.current.value,
        lastname: lastNameRef.current.value,
        age: ageRef.current.value,
        location: locationRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };

      const result = await axios.post('http://localhost:4000/api/auth/signup', userInfo);
      const data = await result.data;

      loginUser(data?.user, data?.token);

      navigate('/dashboard');
      return data;
    } catch (error) {
     
      throw error; 
    }
  };

  return {
    firstNameRef,
    lastNameRef,
    ageRef,
    locationRef,
    emailRef,
    passwordRef,
    handleSignUp,
 
  };
};

export default useSignUp;
