import {useEffect, useState} from 'react';
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
import { Badge } from '@mui/material';


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
    path: '/dashboard',
  },
  {
    name: 'Logout',
    icon: <ExitToAppIcon/>,
  }
];

function AdminLayout({children}) {
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
        <Typography
          variant="h6"
          
          >
             MDRRMO LOGO
          </Typography>        
      </Toolbar>

      <Divider
      />
<List>
  <NavLink to="/dashboard" >
    <ListItem key="Dashboard" disablePadding className={location.pathname == '/dashboard' ? 'bg-gray-200' : null }>
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
        <Badge color="secondary" badgeContent={22}>
          <AssessmentIcon className="text-content" />
          </Badge>
        </ListItemIcon>
        <ListItemText primary="Incidents" />
      </ListItemButton>
    </ListItem>
  </NavLink>

  <NavLink to="/users">
    <ListItem key="Users" disablePadding className={location.pathname == '/users' ? 'bg-gray-200' : null}>
      <ListItemButton>
      
        <ListItemIcon>
        <Badge color="secondary" badgeContent={22}>
          <Groups3Icon className="text-content" />
          </Badge>
        </ListItemIcon>
       
        <ListItemText primary="Users" />
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

  /* AdminLayout(props)
const { window } = props;
const container = window !== undefined ? () => window().document.body : undefined;
*/

  return (
    <Box sx={{ display: 'flex'  }}
      className={'bg-bkg text-content min-h-[100svh]'}
    
    >
    
      <CssBaseline />
      <AppBar
        
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
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
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
          
          variant="h6" noWrap component="div">
             Incident Reporting and Analysis System  
          </Typography>
          
          <Box 
          className= "ml-auto bg-bkg text-content"
          sx={{ flexGrow: 0 }}>
            
           
            <Tooltip
            
            title="Open settings">
              <IconButton 
              
              onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar src='jomar.png' alt={currUserName.toUpperCase()}  />
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
        aria-label="mailbox folders"
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
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
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