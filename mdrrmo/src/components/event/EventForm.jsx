import React, { useRef, useState } from 'react' 
import {useQuery, useQueryClient} from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'
import Container from '@mui/material/Container'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Stack from '@mui/material/Stack'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import {useAuth} from '../../context/AuthContext'

import EventList from './EventList'

const EventForm = () => {
  const [pending, setPending] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const eventTypeRef = useRef()
    
    const eventLocationRef = useRef()
    const eventDescriptionRef = useRef()
    const startDateRef = useRef()
    const endDateRef = useRef()
    const eventOrganizerRef = useRef()
    const eventLinkRef = useRef()

    const {user, token} = useAuth()

    const queryClient = useQueryClient()

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    const onClose = () => {
        setIsModalOpen(false)
    }

   

    const handleAddEvent = async () => {
      setPending(true)
      try{  
        const eventData = {
          type: eventTypeRef.current.value,
          location: eventLocationRef.current.value,
          description: eventDescriptionRef.current.value,
          start_date: startDateRef.current.value,
          end_date: endDateRef.current.value,
          organizer: eventOrganizerRef.current.value,
          link: eventLinkRef.current.value,
          user_id: user.user_id,
        }
        console.log(eventData)
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/events/`, eventData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        } )
        const data = await response.data
        

        toast.success(data.message, {
          position: toast.POSITION.RIGHT,
          autoClose: 3000,
          style: {
            backgroundColor: 'green',
            color: 'white',
          },
        });
        setIsModalOpen(false)
        queryClient.invalidateQueries(['events'])
       
        return data
      }
      catch(error){
        toast.error(`${error.response.data.error}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          style: {
            backgroundColor: '#2f2d2d',
            color: 'white',
          },
        });
   

    }
    finally{
      setPending(false)
    }
  }

  return (
    <>




    <Container maxWidth= "lg">
    
       
           
    <Stack
              sx={{ pt: 1, pb:2   }}
              direction="row"
              spacing={2}
              justifyContent= "end"
             
            >
              <Button variant="contained" 
               disabled= {pending}
               onClick={() => setIsModalOpen(true)}
               > <AddIcon/> Post Event</Button>
        
            </Stack>
         
          <EventList/>
     
    <Dialog open= {isModalOpen} onClose={onClose} >
    <DialogTitle variant="h5">Post Event</DialogTitle>
        <DialogContent
         sx ={{width: {lg: '450px'} }}
        >
        

           
        

        <FormControl sx= {{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        
            <TextField             
                sx = {{marginTop: 2}}
                 name="eventType"
                 required
                 fullWidth
                 id="eventType"
                 label="Event Type"
                 placeholder= 'eg. (Search and Rescue Exercises)'
                 autoFocus
                 type='text'
                 inputRef={eventTypeRef}
            />



<TextField             
                 name="eventLocation"
                 required
                 fullWidth
                 id="eventLocation"
                 label="Event Location"
                type='text'
                 inputRef={eventLocationRef}
            />

             


            

            <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder="Event Details / Description..."
                style={{padding: 10, background: 'transparent', border: '1px solid lightgray'}}
                fullwidth= 'true'
                ref={eventDescriptionRef}
                />
                <TextField             
                 name="startDate"
                 required
                 fullWidth
                 id="startDate"
                 inputRef={startDateRef}
                type='datetime-local'
                
            />

<TextField             
                 name="endDateRef"
                 required
                 fullWidth
                 id="endDateRef"
                 inputRef={endDateRef}
                type='datetime-local'
                
            />

<TextField             
                 name="eventOrganizer"
                 required
                 fullWidth
                 id="eventOrganizer"
                 label= 'Event Organizer'
                 inputRef={eventOrganizerRef}
                type='text'
                
                
            />

<TextField             
                 name="eventLink"
                 required
                 fullWidth
                 id="eventLink"
                 label= 'Link for Additional Information (Optional)'
               inputRef={eventLinkRef}

                placeholder='https://www.example.com'
                type='url'
                
                
            />


                
        </FormControl>
    
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddEvent}>
            <CheckIcon />Done
          </Button>
        </DialogActions>
                </Dialog>
       

        </Container>
    </>
  )
}

export default EventForm