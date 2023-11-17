// LineChart.js
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const LineChart = () => {
  const fetchMonthlyData = async () => {
    try {
      const result = await axios.get(`http://localhost:4000/api/dashboard/linechart`);
      console.log(result.data)
      return result.data;
    } catch (error) {
      throw new Error('Error fetching monthly data');
    }
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['linechart'],
    queryFn: fetchMonthlyData,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching monthly data</p>;
  }

  const { series, categories } = data;

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
    <>
      <div className="w-full">
        <Toolbar>
          <Typography variant="h6">Incidents Reported Monthly</Typography>
        </Toolbar>
        <Divider sx={{ marginBottom: '10px' }} />
        <ReactApexChart options={chartOptions} series={series} type="line" />
      </div>
    </>
  );
};

export default LineChart;
