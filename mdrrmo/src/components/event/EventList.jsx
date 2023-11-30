import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import EventDetail from './EventDetail';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import  Container  from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Event from '@mui/icons-material/Event';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import AccessTime from '@mui/icons-material/AccessTime';
import History from '@mui/icons-material/History';



function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}



function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

 function EventList() {
  const [value, setValue] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [happeningNowEvents, setHappeningNowEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  const { token } = useAuth();


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      // Categorize events based on status
   const upcoming = data.filter(event => event.status == 'upcoming');
   const happeningNow = data.filter(event => event.status =='happening now');
   const past = data.filter(event => event.status == 'past');

   setUpcomingEvents(upcoming);
   setHappeningNowEvents(happeningNow);
   setPastEvents(past);


      return data;
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const {data, isLoading} = useQuery({
    queryKey: ['events', ],
    queryFn: fetchEvents,
  })

 
  if (isLoading ) {
    return  <p>Loading, please wait...</p>  
  }




  return (
    <Box sx={{ width: '100%' }}>
       <Divider sx= {{margin: 2}}>
        <Typography variant='h6'>
          Event List
        </Typography>
      </Divider>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
          orientation="horizontal"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{ borderRight: 1, borderColor: 'divider'}}
        >
         <Tooltip title= "All Events" placement="top">
          <Tab icon={<Event />} {...a11yProps(0)} />

         </Tooltip>

         <Tooltip title= "Upcoming Events" placement="top">
         <Tab  icon={<AccessTime />} {...a11yProps(1)} />

         </Tooltip>
         <Tooltip title= "Happening Now" placement="top">
         <Tab  icon={<AlarmOnIcon />} {...a11yProps(2)} />

         </Tooltip>
          
         <Tooltip title= "Past Events" placement="top">
         <Tab icon={<History />} {...a11yProps(3)} />

         </Tooltip>
          

        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
          <EventDetail events={data} title= "All EVENTS" />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <EventDetail events={upcomingEvents} title= "UPCOMING EVENTS"/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <EventDetail events={happeningNowEvents} title= "HAPPENING NOW" />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <EventDetail events={pastEvents} title= "PAST EVENTS" />
        </CustomTabPanel>
       
    </Box>
  );
}


export default EventList