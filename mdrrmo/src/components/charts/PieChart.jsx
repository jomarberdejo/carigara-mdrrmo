
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

  const getColorForSeverity = (severity) => {
    switch (severity.toLowerCase()) {
      case 'uncategorized':
        return '#000000'; 
      case 'severe':
        return '#FF0000'; 
      
      case 'moderate':
        return '#0000FF'; 
        case 'mild':
        return '#F28C28'; 
      default:
        return '#000000'; 
    }
  };
  
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
    colors: labels.map((label) => getColorForSeverity(label)),
  };
  

  return (
    <div className= {`w-full  ${data?.series?.length === 0 ? "hidden" : "block"} col-span-1`}>
      <Toolbar>
        <Typography variant="h6">Reported Incidents Severity</Typography>
      </Toolbar>
      <Divider sx={{ marginBottom: '10px' }} />
      <ReactApexChart options={chartOptions} series={series} type="donut" />
    </div>
  );
};

export default PieChart;
