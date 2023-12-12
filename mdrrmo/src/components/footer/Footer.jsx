import { NavLink} from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'; 
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import FacebookIcon from '@mui/icons-material/Facebook';
import CarigaraLogo from '../../assets/images/Carigara-Logo.png'

const  Copyright = () => {
    return (
      <Typography variant="body2" color="text.secondary" align="center" sx= {{textWrap: 'balance', margin: 'auto'}}>
        {'Copyright © '}
        <span >
        {new Date().getFullYear()} MDRRMO Municipality of Carigara, Leyte. All Rights Reserved.


        </span>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
  

const Footer = () => {
  return (
     <Container>
          <Divider/>
      <Box sx={{ bgcolor: 'background.paper', p: 4, minHeight: '150px'}} component="footer">
        <footer className='flex justify-evenly items-start flex-wrap gap-4'>

      
        <div>
          <img src= {CarigaraLogo} 
          className='max-w-[150px]'
          />
        </div>
        
        <div>
          <Typography variant = "h6" align="center">
            Quick Links
          </Typography>
          <List>
            <ListItem sx= {{textAlign: 'center', display: 'block'}}>
                <NavLink
                to = "/" className='cursor-pointer text-blue-500 hover:underline hover:underline-offset-2 '>Homepage</NavLink>
            </ListItem> 
            <ListItem  sx= {{textAlign: 'center', display: 'block'}}>
                <NavLink to= "/profile" className='cursor-pointer  text-blue-500 hover:underline hover:underline-offset-2 '>Profile</NavLink>
            </ListItem>
            <ListItem sx= {{textAlign: 'center', display: 'block'}}>
                <NavLink to = "/eventlist"  className='cursor-pointer  text-blue-500 hover:underline hover:underline-offset-2 '>Events</NavLink>
            </ListItem>
           
          </List>
        </div>

        <aside className='flex flex-col gap-4'>
        <Typography variant="h6" align="center">
          Contact Us
        </Typography>
        <Link
          target = '_blank'
          align="center"
          href= 'mailto:carigaralgu@yahoo.com '
          sx= {{textDecoration: 'none'}}
          className=' text-blue-500 hover:underline hover:underline-offset-2'
        >
          carigaralgu@yahoo.com
        </Link>
        
        <Link
          align="center"
        
          href= 'https://www.google.com/maps/dir//11.3008452,124.6869655/@11.3008431,124.6044715,12z/data=!3m1!4b1!4m4!4m3!1m1!4e2!1m0?entry=ttu'
          target= '_blank'
          sx= {{textDecoration: 'none'}}
          className=' text-blue-500 hover:underline hover:underline-offset-2'
        >
          A. T. Aguja Street, Carigara, Philippines
        </Link>
        <Link
        align="center"
        href= 'tel:09498608899' target= "_blank"
        sx= {{textDecoration: 'none'}}
        className=' text-blue-500 hover:underline hover:underline-offset-2'
        >
          09498608899
         
        </Link>
        <Link
      
        className='flex items-center justify-center text-blue-500 hover:underline hover:underline-offset-2'
         href= "https://www.facebook.com/DRRMOCarigara" target= "_blank" sx= {{textDecoration: 'none'}}>
            
          <FacebookIcon/> Facebook Page
        </Link>
        <Typography variant="body2" color="text.secondary" align="center">
          Office Hours: <span className='text-green-500'>Always Open</span>
        </Typography>
        
       
       
       
        </aside>
        <Copyright />
        </footer>
      </Box>
            </Container> 
  )
}

export default Footer