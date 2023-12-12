
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import LocationOn from '@mui/icons-material/LocationOn';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { useAuth } from '../context/AuthContext';


function Incident() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth();

  const fetchSingleIncident = async () => {
    const result = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/reports/${Number(id)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    const data = await result.data[0]
    return data
  }

  const { data, isLoading } = useQuery({
    queryKey: ['singleIncident'],
    queryFn: fetchSingleIncident,
  })

  const imageUrl = data?.file_path ? `${data?.file_path}` : null


  if (isLoading) {
    return <p>Loading, please wait...</p>
  }






  return (
    <Container maxWidth= "md">
      <Divider sx={{ margin: 1 }}>
        <Typography variant='h5'>
          Incident Report
        </Typography>
      </Divider>

      <Card sx={{ maxWidth: "100%" }} className='block mx-auto' >
        <Box className='flex sm:flex-row justify-between items-start sm:items-center  flex-col'>
          <CardHeader
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate(`/user/${data?.user_id}`)}

            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="user-profile"
              >
                {data?.firstname[0]}
              </Avatar>
            }
            title={`${data?.firstname} ${data?.lastname}`}
            subheader={data?.reported_at}
          >

          </CardHeader>


          <Typography aria-label="status" className='text-red-600 flex items-center gap-1 px-4 mb-2' variant='h6'>
            <PendingActionsIcon /> Status: {data?.status}
          </Typography>



        </Box>
        {imageUrl !== null && (
          imageUrl?.includes('mp4') ? (
            <CardMedia
              component="video"
              controls
              height="194"
              src={imageUrl}
              alt={`Video`}
            />
          ) : (
            <CardMedia
              component="img"
              height="194"
              image={imageUrl}
              alt={`Image`}
            />
          )
        )}




        <CardContent>

          <Divider sx={{ marginBottom: 2 }} />
          <Typography aria-label="status" className='text-gray-600 text-base' sx={{ marginBottom: 1 }} >
          <WarningIcon className='text-gray-700'/> <span className='font-bold text-gray-700'> Severity: </span> {data?.severity}
          </Typography>
          <Typography aria-label="location" className='text-gray-600 text-base' sx={{ marginBottom: 1 }} >
          <LocationOn className='text-gray-700'/><span className='font-bold text-gray-700'> Location: </span> {data?.location}
          </Typography>


          <Typography aria-label="description" className=' text-gray-600 text-base' sx={{ marginBottom: 1 }} >
          <CheckCircleIcon className='text-gray-700'/> <span className='font-bold text-gray-700'> Description: </span> {data?.description}
          </Typography>



        </CardContent>


      </Card>
    </Container>
  );
}
export default Incident