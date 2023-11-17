import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';



const ProfilePage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    age: '',
    role: '',
    location: '',
  })
  const { user } = useAuth();

  console.log(user)
  
  const fetchUser = async () => {
    const result = await axios.get(`http://localhost:4000/api/users/${user.user_id}`);
    const data = result.data[0]
    console.log(data)
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
      console.log(data);
      localStorage.setItem('user', JSON.stringify(userData));

      // Invalidate the query to refetch the updated user data
      queryClient.invalidateQueries(['user', userData.user_id]);

      setModalOpen(false);
    } catch (error) {
      throw new Error(error.result?.data?.message || 'Failed to update profile');
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
              width: 100,
              height: 100,  
            }}
            alt={userData?.firstname}
            src="/path_to_user_avatar.jpg"
          />
        </Toolbar>
        <Divider sx={{ marginTop: 2 }} />
        <Typography variant="h5" sx={{ marginTop: 2 }}>
          {`${userData?.firstname} ${userData?.lastname}`}
        </Typography>
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Age: {userData?.age}
          </Typography>
        </Box>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          {`Role: ${userData?.role}`}
        </Typography>
        <Typography variant="body1">Location: {userData?.location}</Typography>
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
            <TextField
              label="Role"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={formData.role}
              disabled
            />
            <TextField
              label="Location"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
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



