


import {useEffect, useState} from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import {useAuth} from '../context/AuthContext'
import { useGetUser } from '../hooks/useGetUser';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';  
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';

import Link from '@mui/material/Link';




function Copyright() {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
  
export default function UserLayout({children}) {
    


    const {fetchUser} = useGetUser()
  const navigate = useNavigate()
  const location = useLocation();
  const [currUserName, setCurrUserName] = useState('')

  const {logoutUser, user} = useAuth();
 
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUser(user.user_id);
        setCurrUserName(userData.firstname);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, [fetchUser, user.user_id]);

const settings = [
  {
    name: 'Profile',
    icon: <PersonIcon/>,
    path: '/profile',
  },
  {
    name: 'Homepage',
    icon: <HomeIcon/>,
    path: '/',
  },
  {
    name: 'Logout',
    icon: <ExitToAppIcon/>,
  }
];

  const [anchorElUser, setAnchorElUser] = useState(null);

  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  
  const handleLogout = ()  => {
    logoutUser()
    navigate('/')
  }
  
  
  return (
    <>

          <AppBar
      
        position= 'fixed'
        sx= {{marginBottom : '10px', background: 'transparent'}}
        
      >
        <Toolbar
        className = "bg-bkg text-content h-[65px]"
        >
          <Typography
          
          variant="h6" sx= {{fontWeight: 'medium'}} noWrap component="h1">
             MDRRMO CARIGARA
          </Typography>
          
          <Box 
          className= "ml-auto bg-bkg text-content"
          sx={{ flexGrow: 0 }}>
            
           
            <Tooltip
            
            title="Open settings">
              <IconButton 
              
              onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar   src= {currUserName}
                sx={{ backgroundColor: '#EE4B2B' }}  alt={currUserName.toUpperCase()}  />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '53px' }}
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                


                <MenuItem key={setting.name} onClick={setting.name === "Logout" ? handleLogout : ()=> navigate(setting.path)}>
                  <ListItemIcon>
                    {setting.icon}
                   
                  </ListItemIcon>
                  <Typography textAlign="center">{setting.name}</Typography>
                </MenuItem>
                  
              ) 
           
              )}
            </Menu>
          </Box>
          
        </Toolbar>
      </AppBar>
      <Box sx= {{marginTop: '100px'}}>
      {children}
      </Box>
                
      {/* Footer
      <Box sx={{ bgcolor: 'background.paper', p: 6, minHeight: '200px'}} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box> */}
     </>
  );
}