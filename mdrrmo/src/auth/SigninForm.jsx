
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import useSignIn from '../hooks/useSignIn';
import logo from '../assets/images/mdrrmo-logo.png';
import { toast } from 'react-toastify';



const SignInForm = () => {
  const [pending, setPending] = useState(false)
  const { emailRef, passwordRef, handleSignIn } = useSignIn();
 
  const handleSubmit = async(event) => {
    event.preventDefault(); 
 
    setPending(true)
    try {
      const credential = await handleSignIn();
      toast.success(`Logged in as: ${credential.user.firstname} ${credential.user.lastname}`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        style: {
          backgroundColor: 'green',
          color: 'white',
        },
      });
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
    finally{
      setPending(false)
    }
   
    
  };


  

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${logo})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} md={12} lg={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            mx: 4,
            justifyContent: 'center',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              inputRef={emailRef}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              inputRef={passwordRef}
            />

           

            <Button
              type="submit"
              fullWidth
              disabled = {pending}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link to="/signup">
                  <Typography variant="body2">
                    Don't have an account? <span className="underline underline-offset-4">Sign Up</span>
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignInForm;
