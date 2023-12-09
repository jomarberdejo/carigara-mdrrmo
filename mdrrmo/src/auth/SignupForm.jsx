
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import  Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import useSignUp from '../hooks/useSignUp';
import { toast } from 'react-toastify';
import {locationOptions} from '../utils/locationOptions'

const SignUpForm = () => {
  const [pending, setPending] = useState(false)
  const {
    firstNameRef,
    lastNameRef,
    ageRef,
    contactRef,
    locationRef,
    emailRef,
    passwordRef,
    confirmPasswordRef,
    handleSignUp,
  } = useSignUp();

  



  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true)
    try {
      const credential = await handleSignUp();
      toast.success(`Logged in as: ${credential.user.firstname} ${credential.user.lastname}`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        style: {
          backgroundColor: 'green',
          color: 'white',
        },
      });
    } catch (error) {
      toast.error(`Sign Up Failed: ${error.response.data.error}`, {
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
    <Container component="main" maxWidth="xs"> 
      <Box
        sx={{
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100svh',
          padding: "15px",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                inputRef={firstNameRef}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                inputRef={lastNameRef}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="age"
                label="Age"
                name="age"
                autoComplete="age"
                type='number'
                inputRef={ageRef}
              />
            </Grid>
       
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="contact"
                label="Contact Number (en-PH)"
                name="contact"
                placeholder='01234567891'
                autoComplete="contact"
                type="tel"
                inputRef={contactRef}
              />
            </Grid>
            <Grid item xs={12}>
            <Typography variant='body1' sx={{ color: 'gray', marginBottom: 1}}>Location*</Typography>
              <FormControl fullWidth>
                
                <Select
                  labelId="location-select-label"
                  id="location-select"
                  inputRef= {locationRef}
                  defaultValue=''
                >
                  {locationOptions.map((location, index) => (
                    <MenuItem key={index} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> 
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                inputRef={emailRef}
              />
            </Grid>

            <Grid item xs={12}>
            <Typography variant= "body2 text-gray-500">
            Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)
            </Typography>
            <Tooltip  title="Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)" placement="top-end">
            
            <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                sx= {{marginTop: '10px'}}
                inputRef={passwordRef}
              />
          </Tooltip>
              
            </Grid>

            <Grid item xs={12}>
            <Tooltip  title="Make sure both passwords match." placement="top-end">
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="confirmPassword"
                
                inputRef={confirmPasswordRef}
              />
              </Tooltip>
            </Grid>
            {/* <Grid item xs={12}>
            <Typography variant='body1' sx={{ color: 'gray'}}>Role (User / Admin)*</Typography>
            <FormControl fullWidth>

              <Select
                labelId="role-select-label"
                defaultValue="User"
                disabled
               
                inputRef={roleRef}>
              
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                    
              </Select>
            </FormControl>   </Grid> */}

          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled = {pending}
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
         
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link to="/">
                <Typography variant="body2">
                  Already have an account? <span className="underline underline-offset-4">Sign In</span>
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUpForm;
