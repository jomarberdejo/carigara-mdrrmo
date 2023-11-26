// LineChart.js
import React from 'react';
import {useAuth} from '../../context/AuthContext'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';



const LineChart = () => {
  const {token} = useAuth()
  const fetchMonthlyData = async () => {
    try {
      const result = await axios.get(`http://localhost:4000/api/dashboard/linechart`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
       }
      );
        
      return result.data;
    } catch (error) {
      throw new Error('Error fetching monthly data');
    }
  };

  const fetchReports = async() => {
    const response = await axios.get('https://mdrrmoserver.onrender.com/api/reports/', 
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
     })
    const data = await response.data

    return data
  }
  const { data:allReports, isLoading: isAllReportsLoading } = useQuery({
    queryKey: ['allreports'],
    queryFn: fetchReports,
  });

  const { data, error, isLoading } = useQuery({
    queryKey: ['linechart'],
    queryFn: fetchMonthlyData,
  });

  if (isLoading || isAllReportsLoading) {
    return  null
  }

  if (error) {
    return <p>Error fetching monthly data</p>;
  }



  const { series, categories } = data ? data : [];

const chartOptions = {
  chart: {
    type: 'line',
    toolbar: {
      show: false,
    },
  },
  xaxis: {
    categories: categories, 
  },
};




  return (
    
      <div className={`w-full col-span-1 bg-white ${allReports?.length === 0 && "hidden"}`}>
        <Toolbar>
          <Typography variant="h6">Incidents Reported Monthly</Typography>
        </Toolbar>
        <Divider sx={{ marginBottom: '10px' }} />
        <ReactApexChart options={chartOptions} series={series} type="line" />
      </div>
    
  );
};

export default LineChart;
