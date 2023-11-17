
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const Incident = () => {
    const {id} = useParams()
    console.log(id)
    const fetchSingleIncident = async() =>{
        const result = await axios.get(`http://localhost:4000/api/reports/${Number(id)}`)
        const data = await result.data[0]
        return data
    }

    const {data, isLoading} = useQuery({
      queryKey: ['singleIncident'],
      queryFn: fetchSingleIncident,
    })  
    console.log(data)
    const imageUrl = `http://localhost:4000/${data?.file_path}`

    if (isLoading) {
      return <div>Loading...</div>;
  }
  return (
    <>
     <div>Incident {id} </div>
     <img src={imageUrl} />
    </>
   
  
  )
}

export default Incident