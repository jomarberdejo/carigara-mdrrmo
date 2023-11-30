// Cards.js

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';

import CardItem from './CardItem';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import SummarizeIcon from '@mui/icons-material/Summarize';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PendingIcon from '@mui/icons-material/Pending';
import { useAuth } from '../../context/AuthContext';



const Cards = () => {
  const {token} = useAuth()
  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/dashboard/stats/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
      
    } catch (error) {
      throw new Error('Error fetching reports');
    }
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchReports,
  });

  if (isLoading ) {
    return  <p> Loading, please wait... </p>
  }

  if (error) {
    return <p>Error fetching reports</p>;
  }

  
  const { totalIncidents, ongoingIncidents, pendingIncidents, resolvedIncidents } = data ? data : [];

  const ongoingPercentage = (ongoingIncidents / totalIncidents) * 100 || 0;
  const pendingPercentage = (pendingIncidents / totalIncidents) * 100 || 0;
  const resolvedPercentage = (resolvedIncidents / totalIncidents) * 100 || 0;

  return (
    <>
      <Toolbar>
        <Typography variant="h6">Reported Incidents Statistics</Typography>
      </Toolbar>
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        <CardItem title="Reported Incidents" values={totalIncidents} icon= {<SummarizeIcon/>} />
        <CardItem title="Ongoing" values={`${ongoingPercentage.toFixed(2)}%`} icon= {<DirectionsBikeIcon/>} />
        <CardItem title="Pending" values={`${pendingPercentage.toFixed(2)}%`} icon= {<PendingIcon/>} />
        <CardItem title="Resolved" values={`${resolvedPercentage.toFixed(2)}%`} icon= {<DoneAllIcon/>}  />
      </div>
    </>
  );
};

export default Cards;
