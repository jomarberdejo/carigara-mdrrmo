
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
import { IconButton, Tooltip } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';



const EventDetail = ({events, title}) => {
  const queryClient = useQueryClient()
  const {user, token} = useAuth()

  const handleDeleteEvent = async(event_id) => {
    if (confirm("Are you sure you want to delete this event?") === true){
      const response = await axios.delete(`http://localhost:4000/api/events/${event_id}`, {
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
      <Typography variant='h6' sx= {{marginBottom: 4}}>{title}</Typography>
   
      <Masonry columns={{ sm:1, md: 2 ,lg:3, xl: 4}} spacing={2}>
        {events?.length > 0 ? events?.map((event, index) => (
          <Paper key={index}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
               
                <Typography variant= 'body2'>{event.start_date} -  {event.end_date}</Typography>
            
             
              </AccordionSummary>
              
              <AccordionDetails sx= {{display:'flex', flexDirection: 'column', gap: 1, color: "gray"}}>
               
                <Typography>Event Status: <span className='text-red-500'>{event.status.toUpperCase()}</span></Typography>
                <Typography>Event Type: <span className='text-gray-700'> {event.type} </span></Typography>
                <Typography>Event Venue: <span className='text-gray-700'> {event.location} </span></Typography>
                <Typography>Event Details: <span className='text-gray-700'> {event.description} </span></Typography>
                <Typography>Event Organizer: <span className='text-gray-700'>  {event.organizer}</span></Typography>
                
                  {event.link ? (
                   <Typography>Additional Info:   <Link href= {event.link} target= '_blank'>{event.link}</Link></Typography> 
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
