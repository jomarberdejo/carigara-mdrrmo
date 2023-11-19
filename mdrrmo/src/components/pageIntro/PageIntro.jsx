
import Typography from '@mui/material/Typography';

const PageIntro = () => {
  return (
      <>
    
      <Typography 
      variant = "h6"
        sx = {{marginBottom: 2, fontWeight: "light"}}
        className= "w-[max-content] border-b-[1px] border-gray-400"
        >
        { location.pathname === '/' ? location.pathname.charAt(0).toUpperCase() + location.pathname.slice(1) + 'dashboard' : location.pathname.charAt(0).toUpperCase() + location.pathname.slice(1)  }
       
      </Typography>
      
      </>
    )
}

export default PageIntro;