import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';

import { toast } from 'react-toastify';
import {locationOptions} from '../../utils/locationOptions.js'

const ProfilePage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    age: '',
    role: '',
    location: '',
  })
  const { user, setUserData} = useAuth();

  
  
  const fetchUser = async () => {
    const result = await axios.get(`http://localhost:4000/api/users/${user.user_id}`);
    const data = result.data[0]
  
    return data
  };

  const queryClient = useQueryClient();


  const { data: userData, isLoading } = useQuery({
    queryKey:['user', user?.user_id],
    queryFn: fetchUser,
  });

  if (isLoading){
    return <div>Loading</div>
  }



  const handleModalOpen = () => {
    setModalOpen(true);
    setFormData({
      firstname: userData?.firstname,
      lastname: userData?.lastname,
      age: userData?.age,
      role: userData?.role,
      location: userData?.location,
    })
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  
  const handleSave = async () => {
    try {
      const result = await axios.patch(`http://localhost:4000/api/users/${userData?.user_id}`, formData);
      const data = await result.data;

        
      const updatedUserData = {
        ...userData,
        firstname: formData.firstname,
        lastname: formData.lastname,
        age: formData.age,
        location: formData.location,
      };
      
      
      toast.success('Profile Updated Sucessfully.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        style: {
          backgroundColor: 'green',
          color: 'white',
        },
      });
      setUserData(updatedUserData);
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
      queryClient.invalidateQueries(['user', userData.user_id]);
      setModalOpen(false);
      return data
    } catch (error) {
      toast.error(`Sign In Failed: ${error.response.data.error}`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        style: {
          backgroundColor: '#2f2d2d',
          color: 'white',
        },
      });
      
    
    }
  };

  return (
    <Card className="w-full mx-auto my-2 py-4">
      <CardContent>
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <Avatar
            sx={{
              background: 'red',
              width: 100,
              height: 100,  
            }}
            alt={userData?.firstname.toUpperCase()}
            src={userData?.firstname}
          />
        </Toolbar>
        <Divider sx={{ marginTop: 2 }} />
        <Typography variant="h5" sx={{ marginTop: 2 }}>
          {`${userData?.firstname} ${userData?.lastname}`}
        </Typography>
      
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
           {`${userData?.age}, ${userData?.role}`}
          </Typography>
    
       
       
        <Typography variant="body1" className='text-gray-600'>Location: {userData?.location}</Typography>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          sx={{
            marginTop: 2,
          }}
          onClick={handleModalOpen}
        >
          Edit Profile
        </Button>
        <Modal open={isModalOpen} onClose={handleModalClose} className="fixed inset-0 flex items-center justify-center">
          <Paper className="max-w-[450px] w-[90%] p-6">
            <Typography variant="h6" gutterBottom sx={{ marginBottom: 2 }}>
              Edit Profile
            </Typography>
            <TextField
              label="Firstname"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            />
            <TextField
              label="Lastname"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            />
            <TextField
              label="Age"
              variant="outlined"
              fullWidth
              type='number'
              sx={{ marginBottom: 2 }}
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
         
            
            <Typography variant='body1' sx={{ color: 'gray'}}>Role (User / Admin)*</Typography>
            <FormControl fullWidth  sx={{ marginBottom: 2 }}>
                
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  disabled = {userData.role === "User" ? true : false}
                >
         
                    <MenuItem  value="User">
                      User
                    </MenuItem>
                    <MenuItem  value="Admin">
                      Admin
                    </MenuItem>
           
                </Select>
              </FormControl> 
         
            
            <Typography variant='body1' sx={{ color: 'gray'}}>Location*</Typography>
            <FormControl fullWidth  sx={{ marginBottom: 2 }}>
                
                <Select
                  labelId="location-select-label"
                  id="location-select"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  
                >
                  {locationOptions.map((location, index) => (
                    <MenuItem key={index} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> 
            <Button variant="contained" onClick={handleSave} sx={{ marginBottom: 2, width: '100%' }}>
              Save
            </Button>
          </Paper>
        </Modal>
      </CardContent>
    </Card>
  );
};

export default ProfilePage;



