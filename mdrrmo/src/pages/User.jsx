import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
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
import EmailIcon from '@mui/icons-material/Email';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import WarningIcon from '@mui/icons-material/Warning';
import LocationOn from '@mui/icons-material/LocationOn';
import Masonry from '@mui/lab/Masonry';
import { useAuth } from '../context/AuthContext';
import LoadingItem from '../utils/LoadingItem';




const User = () => {
  const { id } = useParams();
  const {token} = useAuth()

  const fetchSingleUser = async () => {
    const result = await axios.get(`http://localhost:4000/api/users/${Number(id)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    
    );
    const data = await result.data[0];

    return data;
  };

  const { data: userData, isLoading: userIsLoading, isError: userIsError } = useQuery({
    queryKey: ['singleUser', id],
    queryFn: fetchSingleUser,
  });



  const fetchUserReports = async () => {
    const result = await axios.get(`http://localhost:4000/api/reports/user/${Number(id)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    );
    const data = await result.data;
    return data.map(report => ({
      ...report,
      mediaType: report.file_path ? (report.file_path.includes('.mp4') ? 'video' : 'image') : null,
    }));
  };

  const { data: userReports, isLoading: reportsIsLoading, isError: reportsIsError } = useQuery({
    queryKey: ['userReports'],
    queryFn: fetchUserReports,
  });

  if (userIsLoading || reportsIsLoading) {
  
    return  null  

  }

  if (userIsError || !userData || reportsIsError) {
    return <div>Error loading user data</div>;
  }

  const imageUrlArray = userReports?.map((path) => (path?.file_path ? `http://localhost:4000/${path.file_path}` : null));

  return (
    <Container>
      <Divider sx={{ margin: 1 }}>
        <Typography variant="h5">User Information</Typography>
      </Divider>

      <Card sx={{ maxWidth: "100%" }} className="block mx-auto">
        <Box className="flex justify-end items-center">
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="user-profile">
                {userData.firstname[0]}
              </Avatar>
            }
            title={`${userData.firstname} ${userData.lastname}`}
            subheader={`${userData.age}, ${userData.role} `}
          ></CardHeader>
        </Box>

        <CardContent>
          <Divider sx={{ marginBottom: 2 }} />

          <Typography
            aria-label="email"
            className="text-gray-600 flex items-center gap-1 text-base"
            sx={{ marginBottom: 1 }}
          >
            <EmailIcon className="text-green-700" />
            Email: {userData.email}
          </Typography>

          <Typography
            aria-label="location"
            className="text-gray-600 flex items-center gap-1 text-base"
            sx={{ marginBottom: 1 }}
          >
            <PersonPinCircleIcon className="text-green-700" />
            Location: {userData.location}
          </Typography>
        </CardContent>
      </Card>
    
   
      
      {userReports.length > 0 && (
       
        <Container sx={{ py: 2 }}>
           <Divider sx={{ marginBottom:8, marginTop: 8 }}>
        <Typography variant="h6" > {`${userData.firstname} ${userData.lastname}`}`s Reports</Typography>
        </Divider>
          
          <Masonry  columns={{ sm:1, md:2}}  spacing={2}>
            {userReports.map((report, index) => (
              <div key={report.report_id}>
                  <Card sx={{ maxWidth: 700 }} className='block mx-auto' >
        <Box className= 'flex sm:justify-between sm:items-center flex-col sm:flex-row items-start'>
        <CardHeader

       
        
          avatar={
            <Avatar sx= {{background: 'red'}} aria-label="user-profile"
            >
              {report?.firstname[0]}
            </Avatar>
          }
          title= {`${report?.firstname} ${report?.lastname}`}
          subheader={report?.reported_at}
        >
            
        </CardHeader>

        
        <Typography aria-label="status" className='text-red-600 flex items-center gap-1 px-4' variant='h6'>
           <PendingActionsIcon/> Status: {report?.status}
          </Typography>

           
       
        </Box>
    
       
        {report.mediaType === 'video' ? (
              <CardMedia
                component="video"
                controls
                height="194"
                src={imageUrlArray[index]}
                alt={`Video ${index}`}
              />
            ) : report.mediaType === 'image' ? (
              <CardMedia
                component="img"
                height="194"
                image={imageUrlArray[index]}
                alt={`Image ${index}`}
              />
            ) : null}

        

        <CardContent>

          <Divider sx= {{marginBottom: 2}}/>
          <Typography aria-label="status" className='text-gray-600 flex items-center gap-1 text-base'  sx= {{marginBottom: 1}} >
            <WarningIcon className='text-green-700'/>Severity: {report?.severity}
              </Typography>
              <Typography aria-label="location" className='text-gray-600 flex items-center gap-1 text-base' sx= {{marginBottom: 1}} > 
            <LocationOn className='text-green-700'/>Location: {report?.location}
             </Typography> 

         
            <Typography aria-label="description"className=' text-gray-600 flex items-center gap-1 text-base'  sx= {{marginBottom: 1}} > 
             <CheckCircleIcon className='text-green-700'/>Description: {report?.description}
             </Typography> 
             

         
        </CardContent>


      </Card>
              </div>
            ))}
          </Masonry>
        </Container>
      )}
    </Container>
  );
};

export default User;
