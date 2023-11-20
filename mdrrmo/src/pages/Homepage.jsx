import {useState, useRef} from 'react'
import { useAuth } from '../context/AuthContext';
import { locationOptions } from '../utils/locationOptions';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import WarningIcon from '@mui/icons-material/Warning';
import LocationOn from '@mui/icons-material/LocationOn';
import DeleteIcon from '@mui/icons-material/Delete';
import  IconButton  from '@mui/material/IconButton';



const Homepage = () => {

 
  const [isModalOpen, setModalOpen] = useState(false);
  const severityRef = useRef(null);
  const descriptionRef = useRef(null);
  const locationRef = useRef(null);
  const statusRef = useRef(null);
  const filepathRef = useRef(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const fetchReports = async () => {
    const result = await axios.get(`http://localhost:4000/api/reports/user/${user.user_id}`);
    const data = await result.data;
    const sortedIncidents = data.sort((a, b) => new Date(b.reported_at) - new Date(a.reported_at));
    return sortedIncidents;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['userReport'],
    queryFn: fetchReports,
  });

  if (isLoading) {
    return <div>Loading</div>;
  }

  const imageUrlArray = data.map((path) => (path?.file_path ? `http://localhost:4000/${path.file_path}` : null));

  const onClose = () => {
    setModalOpen(false);
  };

 
  const handleDeleteReport = async(id) => {
    if (confirm("Are you sure you want to delete this report?")=== true){
      try{
        const result = await axios.delete(`http://localhost:4000/api/reports/${id}`)
        const data = await result.data;
        toast.success(data.message, {
          position: toast.POSITION.RIGHT,
          autoClose: 3000,
          style: {
            backgroundColor: 'green',
            color: 'white',
          },
        });
        queryClient.invalidateQueries(['reports'])
        return data
      }
      catch(error){
        toast.error(`${error.response.data.error}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          style: {
            backgroundColor: '#2f2d2d',
            color: 'white',
          },
        });
      }
      
    }
  }
 

  const handleAddReport = async () => {
    
    try {
      const file = filepathRef.current.files[0]
      if (file && !file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast.error('Please upload only an image or video.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          style: {
            backgroundColor: '#2f2d2d',
            color: 'white',
          },
        });
        return;
      }

      const formData = new FormData();
      formData.append('severity', severityRef.current.value);
      formData.append('description', descriptionRef.current.value);
      formData.append('location', locationRef.current.value);
      formData.append('status', statusRef.current.value);
      formData.append('file_path', filepathRef.current.files[0]);
      formData.append('user_id', user.user_id);
      
      const result = await axios.post('http://localhost:4000/api/reports/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const responseData = await result.data;

      setModalOpen(false);
      toast.success('Report Added Successfully.', {
        position: toast.POSITION.RIGHT,
        autoClose: 3000,
        style: {
          backgroundColor: 'green',
          color: 'white',
        },
      });

      queryClient.invalidateQueries(['reports']);
      return responseData;
    } catch (error) {
      toast.error(`${error.response.data.error}`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        style: {
          backgroundColor: '#2f2d2d',
          color: 'white',
        },
      });
    }
  };

  return (
    <main>
      <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 4,
            pb: 2,
          }}
        >
          <Container maxWidth="sm">
            
            
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained" 
               onClick={() => setModalOpen(true)}
               > <AddIcon/> Report Incident or Concern</Button>
              <Button variant="outlined">View Upcoming Events</Button>
            </Stack>

            <Typography
              component="h1"
              variant= 'h4'
              align="center"
              color="text.primary"
              gutterBottom
              sx= {{marginTop: 8}}
            >
              My Reports
            </Typography>
          </Container>
        </Box>
      <Container sx={{ py: 8 }} maxWidth="md">
      {data?.length > 0 ? (
        <Masonry columns={{md:1,lg:2}} sx= {{margin: 'auto'}} spacing={4}>
        
           {data.map((report, index) => (
              <div key={report.report_id}>
                   <Card sx={{ maxWidth: 700 }} className='block mx-auto' >
        <Box className= 'flex justify-between  flex-col items-start relative'>
        <CardHeader
        
       
        
          avatar={
            <Avatar sx={{background: 'red'}} aria-label="user-profile"
            >
              {report?.firstname[0]}
            </Avatar>
          }
          action={
            <IconButton
            onClick={()=> handleDeleteReport(report?.report_id)}
            sx= {{position: 'absolute', right: '10px', top: '20px', color: 'red'}} aria-label="settings">
              <DeleteIcon />
            </IconButton>
          }
          title= {`${report?.firstname} ${report?.lastname}`}
          subheader={report?.reported_at}
        > 
            
        </CardHeader>

        
        <Typography aria-label="status"
        sx= {{marginBottom: 2}}
        className='text-red-600 flex items-center gap-1 px-4' variant='h6'>
           <PendingActionsIcon/> Status: {report?.status}
          </Typography>

           
       
        </Box>
    
       
        {imageUrlArray[index] !== null && (
          <CardMedia
            component="img"
            height="194"
            image={imageUrlArray[index]}
            alt={imageUrlArray[index]}
          />
        )}

        

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
        </Masonry> ) : (
          <Typography variant="h4" className="text-gray-700 text-center">
            You haven't submitted any reports yet.
          </Typography>
        )}
      </Container>
      <Dialog open={isModalOpen} onClose={onClose}>
        <DialogTitle variant="h5">Report New Incident</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <Typography variant="body1" sx={{ color: 'gray' }}>
            Severity (Uncategorized / Mild / Moderate / Severe)*
          </Typography>
          <FormControl>
            <Select
              labelId="severity-select-label"
              defaultValue=""
              inputRef={severityRef}
            >
              <MenuItem value="Uncategorized">Uncategorized</MenuItem>
              <MenuItem value="Mild">Mild</MenuItem>
              <MenuItem value="Moderate">Moderate</MenuItem>
              <MenuItem value="Severe">Severe</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Description"
            type="text"
            variant="outlined"
            inputRef={descriptionRef}
          />

          <Typography variant="body1" sx={{ color: 'gray' }}>
            Location*
          </Typography>
          <FormControl fullWidth>
            <Select
              labelId="location-select-label"
              id="location-select"
              inputRef={locationRef}
              defaultValue=""
            >
              {locationOptions.map((location, index) => (
                <MenuItem key={index} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body1" sx={{ color: 'gray' }}>
            Status (Ongoing / Pending / Resolved)*
          </Typography>
          <FormControl>
            <Select
              labelId="status-select-label"
              defaultValue="Ongoing"
              inputRef={statusRef}
              disabled = {user.role === "Admin" ? false : true}
            >
              <MenuItem value="Ongoing">Ongoing</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="body1" sx={{ color: 'gray' }}>
            Image / Video (Optional)*
          </Typography>
          <Button sx={{ border: '1px dashed gray', cursor: 'pointer' }}>
            <input
              type="file"
              className="p-1 cursor-pointer w-full"
              ref={filepathRef}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddReport}>
            <CheckIcon />Done
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default Homepage;


