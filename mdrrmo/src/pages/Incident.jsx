
import { useParams } from 'react-router-dom'
const Incident = () => {
    const {id} = useParams()
    console.log(id)
  return (
    <div>Incident {id} </div>
  )
}

export default Incident