

 import Button from '@mui/material/Button';
 import Container from '@mui/material/Container';
 import Divider from '@mui/material/Divider';
 import Typography from '@mui/material/Typography';
 import Box from '@mui/material/Box';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate()
    return (
        <Container 
        sx= {{display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center', flexDirection: 'column', height: '100svh'}}>
            <Box>
                
                <Typography variant='h5' sx= {{textAlign: 'center', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center'}}>
                    404 Error Page Not Found <SentimentDissatisfiedIcon sx= {{fontSize: 30}}/>
                </Typography>
                <Divider sx= {{marginBottom: 2}}/>
                <Box
                 sx= {{display: 'flex', justifyContent: 'center'}}
                 onClick = {()=> navigate('/')}
                >
                    <Button variant="outlined" 
                        
                        startIcon= {<KeyboardBackspaceIcon/>}
                >
                   Back To Home
               </Button>
                   
                </Box>
                
               

       
            </Box>
        </Container>
    )
}

export default NotFound