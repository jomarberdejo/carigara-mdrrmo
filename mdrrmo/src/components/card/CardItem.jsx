import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';



export default function CardItem({title, values}) {
  const navigate = useNavigate()
  return (
    
    <Card sx={{ minWidth: 275, borderRadius: "1px", boxShadow: "0 1px 3px #ccc"}}>
      <CardContent
      className= "bg-bkg text-content"
      >
        <Typography sx={{ fontSize: 25, fontWeight: "medium" }}  gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" component="div">
          {values}
        </Typography>

      </CardContent>
      <CardActions
className= "bg-bkg text-content"
      >
        <Button size="small" onClick = {()=> navigate('/incidents')}>View</Button>
      </CardActions>
    </Card>
   
  );
}