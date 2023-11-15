import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';

const PieChart = () => {
  const chartData = useMemo(
    () => ({
      series: [44, 55, 13],
      labels: ['High Severity', 'Low Severity', 'Uncategorized'],
    }),
    []
  );

  const chartOptions = useMemo(
    () => ({
      chart: {
        type: 'donut',
      },
      labels: chartData.labels,
      legend: {
        show: true,
        position: 'left',
        formatter: function (seriesName, opts) {
          return `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}`;
        },
      },
      colors: ['#FF5733', '#FFA533', '#A5A5A5'],
    }),
    [chartData.labels]
  );

  return (
    <div  className= 'w-full'>
      <Toolbar>
        <Typography variant="h6">Reported Incidents Severity</Typography>
      </Toolbar>
      <Divider sx={{ marginBottom: '10px' }} />
      <ReactApexChart options={chartOptions} series={chartData.series} type="donut"/>
    </div>
  );
};

export default PieChart;
