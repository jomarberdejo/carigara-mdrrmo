
import { useParams } from 'react-router-dom'
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
import EmailIcon from '@mui/icons-material/Email'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'

function User() {
  const {id} = useParams()
    console.log(id)
    const fetchSingleUser = async() =>{
        const result = await axios.get(`http://localhost:4000/api/users/${Number(id)}`)
        const data = await result.data[0]
     
        return data
    }

    const {data, isLoading, isError} = useQuery({
      queryKey: ['singleUser'],
      queryFn: fetchSingleUser,
    })  
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !data) {
        return <div>Error loading user data</div>;
    }

  

  return (
    <Container>
      <Divider sx={{ margin: 1}}>
        <Typography variant='h5'>
          User Information
        </Typography>
      </Divider>
    
      <Card sx={{ maxWidth: 700 }} className='block mx-auto' >
        <Box className= 'flex justify-end items-center '>
        
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="user-profile">
              {data.firstname[0]}
            </Avatar>
          }
          title= {`${data.firstname} ${data.lastname}`}
          subheader={`${data.age}, ${data.role} `}
        >
            
        </CardHeader>

        
           
       
        </Box>
    
       

        <CardContent>

          <Divider sx= {{marginBottom: 2}}/>
          

            
        <Typography aria-label="email" className='text-gray-600 flex items-center gap-1 text-base'  sx= {{marginBottom: 1}}>
            <EmailIcon className='text-green-700'/>Email: {data.email}
          </Typography>
          
              <Typography aria-label="location" className='text-gray-600 flex items-center gap-1 text-base' sx= {{marginBottom: 1}} > 
            <PersonPinCircleIcon className='text-green-700'/>Location: {data.location}
             </Typography> 

         
           

         
        </CardContent>


      </Card>
    </Container>
  );
}


export default User