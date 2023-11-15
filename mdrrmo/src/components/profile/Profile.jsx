import React, { useState } from 'react';


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
import UploadFileIcon from '@mui/icons-material/UploadFile';
const ProfilePage = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
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
            alt="Jomar Avatar"
            src="/path_to_user_avatar.jpg"
          />
        </Toolbar>
        <Divider sx={{ marginTop: 2 }} />
        <Typography variant="h5" sx={{ marginTop: 2 }}>
          Jomar
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          MDRRMO
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          Email: berdejomarjomar@gmail.com
        </Typography>
        <Typography variant="body1">Location: Carigara, Leyte Philippines</Typography>
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            About Me:
          </Typography>
          <Typography variant="body2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            egestas risus eu sapien volutpat, ac varius enim bibendum.
          </Typography>
        </Box>

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
    <Typography variant="h6" gutterBottom
sx= {{marginBottom: 2}}
    >
      Edit Profile
    </Typography>
    <TextField
      label="Name"
      variant="outlined"
      fullWidth
      sx= {{marginBottom: 2}}
    />
    
    <TextField
      label="Organization"
      variant="outlined"
      fullWidth
sx= {{marginBottom: 2}}
    />
    

    <TextField
      label="Email"
      variant="outlined"
      fullWidth
sx= {{marginBottom: 2}}
    />
    <TextField
      label="Location"
      variant="outlined"
      fullWidth
sx= {{marginBottom: 2}}
    />
   <TextField
      label="Description"
      variant="outlined"
      fullWidth
sx= {{marginBottom: 2}}
    />
    
    <Button
      variant="outlined"
      component="label"
      fullWidth
      className='cursor-pointer'
      startIcon={<UploadFileIcon />}
     sx= {{marginBottom: 3}}
     >
      <input type="file" className='cursor-pointer w-full'/>
    </Button>
    <Button variant="contained" onClick={handleModalClose}
sx= {{marginBottom: 2, width: '100%'}}
    >
      Save
    </Button>
  </Paper>
</Modal>


      </CardContent>
    </Card>
  );
};

export default ProfilePage;
