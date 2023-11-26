
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';




const CardItem = ({title, values, icon}) => {
  const navigate = useNavigate()
  return (
    
    <Card sx={{ minWidth: 275, borderRadius: "1px", boxShadow: "0 1px 3px #ccc", background: 'white'}}>
      <CardContent
      className= "text-content"
      >

      <Box className= 'flex justify-between items-center'>

        <Typography sx={{ fontSize: 25, fontWeight: "medium" }}  gutterBottom>
          {title}
        </Typography>

        <Typography className='text-blue-700'>
        {icon}
        </Typography>
          
     
      </Box>
        <Typography variant="h5" component="div">
          {values}
        </Typography>
    

        
         
  

      </CardContent>
      <CardActions

      >
        <Button size="small" onClick = {()=> navigate('/incidents')}>View</Button>
      </CardActions>
    </Card>
   
  );
}

export default CardItem;