import {useEffect, useState, useRef} from 'react';
import io from 'socket.io-client';
import {toast} from 'react-toastify'
import {NavLink, useNavigate, useLocation} from 'react-router-dom';
import {useAuth} from '../context/AuthContext'
import { useGetUser } from '../hooks/useGetUser';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Groups3Icon from '@mui/icons-material/Groups3';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CarigaraLogo from '../assets/images/Carigara-Logo.png'

const drawerWidth = 260;
const settings = [
  {
    name: 'Profile',
    icon: <PersonIcon/>,
    path: '/profile',
  },
  {
    name: 'Dashboard',
    icon: <DashboardIcon/>,
    path: '/',
  },
  {
    name: 'Logout',
    icon: <ExitToAppIcon/>,
  }
];

function AdminLayout({children}) {
  const {fetchUser} = useGetUser()
  
  const location = useLocation();
  const [currUserData, setCurrUserData] = useState('')


  const socketRef = useRef();
  const navigate= useNavigate()

  useEffect(() => {


   
    socketRef.current = io(import.meta.env.VITE_API_BASE_URL);

  
    socketRef.current.on('notification', ({message, severity}) => {
    
      toast.success(`
      ${message}, (${severity})
      Check It Now!
      `, {
        position: toast.POSITION.RIGHT,
        autoClose: false,
        style: {
          backgroundColor: 'orange',
          color: 'white',
        },
        onClick: () => {
          
          navigate('/incidents');
        },
      
      });
    });

    return () => {
      
      socketRef.current.disconnect();
    };
  }, []); 

  const {logoutUser, user} = useAuth();
 
  const fetchData = async () => {
    try {
      const userData = await fetchUser(user.user_id);
      console.log(userData)
      setCurrUserData(userData);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
   

    fetchData();
  }, [ user]);

  const [anchorElUser, setAnchorElUser] = useState(null);

  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  
  
  
  const [mobileOpen, setMobileOpen] = useState(false);
  
  

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleLogout = ()  => {
    logoutUser()
    navigate('/')
  }
  

  const drawer = (
    <div className = "bg-bkg text-content min-h-full">
      <Toolbar
       className= "flex justify-center"
      >
        <img src={CarigaraLogo} alt= {CarigaraLogo} className='max-w-[200px] my-4'/>   
      </Toolbar>

      <Divider
      />
<List>
  <NavLink to="/" >
    <ListItem key="Dashboard" disablePadding className={location.pathname == '/' ? 'bg-gray-200' : null }>
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon className="text-content" />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
    </ListItem>
  </NavLink>

  <NavLink to="/incidents">
    <ListItem key="Incidents" disablePadding className={location.pathname == '/incidents' ? 'bg-gray-200' : null}>
      <ListItemButton>
        <ListItemIcon>
     
          <AssessmentIcon className="text-content" />
      
        </ListItemIcon>
        <ListItemText primary="Incidents" />
      </ListItemButton>
    </ListItem>
  </NavLink>

  <NavLink to="/users">
    <ListItem key="Users" disablePadding className={location.pathname == '/users' ? 'bg-gray-200' : null}>
      <ListItemButton>
      
        <ListItemIcon>
    
          <Groups3Icon className="text-content" />
       
        </ListItemIcon>
       
        <ListItemText primary="Users" />
      </ListItemButton>
    </ListItem>
  </NavLink>

  <NavLink to="/events">
    <ListItem key="Events" disablePadding className={location.pathname == '/events' ? 'bg-gray-200' : null}>
      <ListItemButton>
      
        <ListItemIcon>
    
          <EventNoteIcon className="text-content" />
       
        </ListItemIcon>
       
        <ListItemText primary="Events" />
      </ListItemButton>
    </ListItem>
  </NavLink>
</List>

      <Divider />
<List>
  <NavLink to="/profile">
    <ListItem key="Profile" disablePadding className={location.pathname == '/profile' ? 'bg-gray-200' : null}>
      <ListItemButton>
        <ListItemIcon>
          <PersonIcon className="text-content" />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>
    </ListItem>
  </NavLink>

  
    <ListItem key="Logout" disablePadding 
    onClick = {handleLogout}
    >
      <ListItemButton>
        <ListItemIcon>
          <ExitToAppIcon className="text-content" />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </ListItem>

</List>

    </div>
  );


  return (
    <Box
      className={'bg-bkg text-content min-h-[100svh]'}
    
    >
    
      <CssBaseline />
      <AppBar
        
        position="fixed"
        sx={{
          width: '100%',
          ml: { sm: `${drawerWidth}px`,
          background: 'transparent',
         
          },
          
          
        }}
      >
        <Toolbar
        className = "bg-bkg text-content"
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: 'block' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
          
          variant="h6" noWrap component="h6">
             MDRRMO Carigara
          </Typography>
          
          <Box 
          className= "ml-auto bg-bkg text-content"
          sx={{ flexGrow: 0 }}>
            
            
            <Tooltip
            
            title="Open settings">
              <IconButton 
              
              onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar   
                 alt={currUserData?.firstname}
                 src={currUserData.profileImagePath ? currUserData?.profileImagePath : currUserData?.firstname}
                sx={{ backgroundColor: '#EE4B2B' }}   />
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
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        
      >

        <Drawer
          /*container = {container} */
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { md: 'block', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer> */}
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 2, width:  '100%' }}
        className='w-full'
      >
        <Toolbar 
        
        />
  
       {children}
     
       

      </Box>
    </Box>
  );
}



export default AdminLayout;