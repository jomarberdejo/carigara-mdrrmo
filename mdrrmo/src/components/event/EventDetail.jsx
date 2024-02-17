import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import LinkIcon from '@mui/icons-material/Link';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';



const EventDetail = ({events, title}) => {
  const queryClient = useQueryClient()
  const {user, token} = useAuth()

  const handleDeleteEvent = async(event_id) => {
    if (confirm("Are you sure you want to delete this event?") === true){
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/events/${event_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.data;

      toast.success(data.message, {
        position: toast.POSITION.RIGHT,
        autoClose: 3000,
        style: {
          backgroundColor: 'green',
          color: 'white',
        },
      });
      
      queryClient.invalidateQueries(['events'])
    }

  }
  
  return (
    <Box sx={{ width: 'auto', minHeight: 250, margin: 'auto', }}>
      <Typography variant='h6' sx= {{marginBottom: 4, marginTop:2}}>{title}</Typography>
   
      <Masonry columns={{ sm:1, md: 2 ,lg:3, xl: 4}} spacing={2} sx= {{margin: 'auto'}}>
        {events?.length > 0 ? events?.map((event, index) => (
          <Paper key={index} >
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
               
                <Typography variant= 'body2'>{event.start_date} -  {event.end_date}</Typography>
            
             
              </AccordionSummary>
              
              <AccordionDetails sx= {{display:'flex', flexDirection: 'column', gap: 1, color: "gray"}}>
               
                <Typography sx = {{color: "#333", fontWeight: 'bold'}}><InfoOutlinedIcon/> Event Status: <span className={`mx-1 ${event.status === "upcoming" ? 'text-blue-500' : event.status === "happening now" ? 'text-yellow-500' : event.status === "past" ? 'text-red-500' : null }`}>{event.status.toUpperCase()}</span></Typography>
                <Typography sx= {{color: '#333', fontWeight: 'bold'}}><CategoryOutlinedIcon/> Event Type: <span className='text-gray-500 mx-1  font-normal'> {event.type} </span></Typography>
                <Typography sx= {{color: '#333', fontWeight: 'bold'}}><RoomOutlinedIcon/> Event Venue: <span className='text-gray-500 mx-1 font-normal'> {event.location} </span></Typography>
                <Typography sx= {{color: '#333', fontWeight: 'bold'}}><DescriptionOutlinedIcon/> Event Details: <span className='text-gray-500 mx-1 font-normal'> {event.description} </span></Typography>
                <Typography sx= {{color: '#333', fontWeight: 'bold'}}x><PersonOutlineIcon/> Event Organizer: <span className='text-gray-500 mx-1 font-normal'>  {event.organizer}</span></Typography>
                
                  {event.link ? (
                   <Typography sx= {{color: '#333', textUnderlineOffset: '2px'}}><LinkIcon/>  <Link href= {event.link} target= '_blank'>{event.link}</Link></Typography> 
                  ) : null
                }
               
              </AccordionDetails>

              { user.role === "Admin" && (
                <Tooltip title="Delete this event" placement='right'>
                <IconButton onClick={() => handleDeleteEvent(event.event_id)}>
                <DeleteIcon sx= {{color: 'red', fontSize: 18, margin: 1}}/> 
                      
              </IconButton>
                </Tooltip>
         
              )}
                
            </Accordion>
           
          </Paper>
        )) : (

          <Typography variant='body1'> No events to display. </Typography>
        )}
      </Masonry>
    </Box>
  );
}

export default EventDetail;