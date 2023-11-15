import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';

const LineChart = () => {
  const years = useMemo(() => Array.from({ length: 10 }, (_, i) => 2023 + i), []);
  const yearlyData = useMemo(() => [45, 0, 0, 0, 0, 0, 0, 0, 0, 0], []);

  const chartData = useMemo(
    () => ({
      series: [
        {
          name: 'Yearly Incidents',
          data: yearlyData,
        },
      ],
      xaxis: {
        categories: years,
      },
    }),
    [years, yearlyData]
  );

  const chartOptions = useMemo(
    () => ({
      chart: {
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: years,
      },
    }),
    [years]
  );

  return (
    <>
      <div  className= 'w-full'>
        <Toolbar>
          <Typography variant="h6">Incidents Reported Yearly</Typography>
        </Toolbar>
        <Divider sx={{ marginBottom: '10px' }} />
        <ReactApexChart options={chartOptions} series={chartData.series} type="line" />
      </div>
    </>
  );
};

export default LineChart;
