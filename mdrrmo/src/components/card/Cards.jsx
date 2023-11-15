
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import CardItem from './CardItem';

const Cards = () => {
  return (
    <>
          <Toolbar
       >
        <Typography
       
        variant= "h6"
        >
        Reported Incidents Statistics
        </Typography>
       </Toolbar>
     <div className= "grid gap-8  md:grid-cols-1  lg:grid-cols-2 ">
        <CardItem title= "Reported Incidents" values= {100} />
        <CardItem title= "Ongoing" values= "20%"/>
        <CardItem title= "Pending" values= "70"/>
        <CardItem title= "Resolved" values= "10%"/>
     </div>
     </>
    )
}

export default Cards;