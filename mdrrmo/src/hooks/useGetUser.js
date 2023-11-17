import axios from "axios"
export const useGetUser = ()=> {
    const fetchUser = async(id) => {
        try{
            const result = await axios.get(`http://localhost:4000/api/users/${id}`)
            const data = result.data[0]
            return data;
        }
        catch(err){
            console.log(err.message)
        }
    }
    return {fetchUser}
}