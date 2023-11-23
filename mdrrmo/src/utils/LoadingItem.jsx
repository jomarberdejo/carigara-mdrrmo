import  CircularProgress  from "@mui/material/CircularProgress"

const LoadingItem = () => {
  return (
    <CircularProgress sx= {{position: 'fixed', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}} color="secondary" />
  )
}

export default LoadingItem