import axios from "axios"
import { useAuth } from "../context/AuthContext"
export const useGetUser = ()=> {
    const {token} = useAuth()
    const fetchUser = async(id) => {
        try{
            const result = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/${id}`,
            {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            )
            const data = result.data[0]
            return data;
        }
        catch(err){
            console.log(err.message)
        }
    }
    return {fetchUser}
}