
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const User = () => {
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
    <>
     <div>User {id} </div>
     <h1>{data?.firstname}</h1>
    </>
   
  
  )
}

export default User;