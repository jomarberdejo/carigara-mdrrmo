// Cards.js

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import CardItem from './CardItem';


const Cards = () => {
  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/dashboard/stats/');
      return response.data;
      
    } catch (error) {
      throw new Error('Error fetching reports');
    }
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchReports,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching reports</p>;
  }

  
  const { totalIncidents, ongoingIncidents, pendingIncidents, resolvedIncidents } = data;

  const ongoingPercentage = (ongoingIncidents / totalIncidents) * 100 || 0;
  const pendingPercentage = (pendingIncidents / totalIncidents) * 100 || 0;
  const resolvedPercentage = (resolvedIncidents / totalIncidents) * 100 || 0;

  return (
    <>
      <Toolbar>
        <Typography variant="h6">Reported Incidents Statistics</Typography>
      </Toolbar>
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        <CardItem title="Reported Incidents" values={totalIncidents} />
        <CardItem title="Ongoing" values={`${ongoingPercentage.toFixed(2)}%`} />
        <CardItem title="Pending" values={`${pendingPercentage.toFixed(2)}%`} />
        <CardItem title="Resolved" values={`${resolvedPercentage.toFixed(2)}%`} />
      </div>
    </>
  );
};

export default Cards;
