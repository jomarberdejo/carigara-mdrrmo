
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';


const PieChart = () => {
  const fetchReports = async() => {
    const response = await axios.get('http://localhost:4000/api/dashboard/piechart')
    const data = await response.data
    return data
  }
  const { data, error, isLoading } = useQuery({
    queryKey: ['piechart'],
    queryFn: fetchReports,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching chart data</p>;
  }


  const { series, labels } = data;

  const chartOptions = {
    chart: {
      type: 'donut',
    },
    labels: labels,
    legend: {
      show: true,
      position: 'left',
      formatter: function (seriesName, opts) {
        return `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}`;
      },
    },
    colors: ['#FF5733', '#FFA533', '#A5A5A5'],
  };

  return (
    <div className="w-full">
      <Toolbar>
        <Typography variant="h6">Reported Incidents Severity</Typography>
      </Toolbar>
      <Divider sx={{ marginBottom: '10px' }} />
      <ReactApexChart options={chartOptions} series={series} type="donut" />
    </div>
  );
};

export default PieChart;
