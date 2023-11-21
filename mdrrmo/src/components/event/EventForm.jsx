import React, { useState } from 'react'
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
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'


const EventForm = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    const onClose = () => {
        setIsModalOpen(false)
    }

  return (
    <>




    <Container maxWidth= "md">

           
    <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained" 
               onClick={() => setIsModalOpen(true)}
               > <AddIcon/> Post Event</Button>
        
            </Stack>

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
                 autoFocus
                //  inputRef={eventTypeRef}
            />

<TextField             
                 name="eventName"
                 required
                 fullWidth
                 id="eventName"
                 label="Event Name"
              
                //  inputRef={eventNameRef}
            />

<TextField             
                 name="eventLocation"
                 required
                 fullWidth
                 id="eventLocation"
                 label="Event Location"
              
                //  inputRef={eventLocationRef}
            />

             
<TextField             
                 name="eventOrganizer"
                 required
                 fullWidth
                 id="eventOrganizer"
                 label= 'Event Organizer'
                  //   inputRef={eventStatusRef}
                type='text'
                
            />

            

            <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder="Event Details / Description..."
                style={{padding: 10, background: 'transparent', border: '1px solid lightgray'}}
                fullWidth

                />
                <TextField             
                 name="eventDate"
                 required
                 fullWidth
                 id="eventDate"
                 
                type='date'
                
            />
<Select
              labelId="status-select-label"
              defaultValue=""
            //   inputRef={eventStatusRef}
            >
              <MenuItem value="Ongoing">Ongoing</MenuItem>
              <MenuItem value="Upcoming">Upcoming</MenuItem>
              <MenuItem value="Past">Past Events</MenuItem>
            </Select>
           
            


                
        </FormControl>
    
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={''}>
            <CheckIcon />Done
          </Button>
        </DialogActions>
                </Dialog>
       

        </Container>
    </>
  )
}

export default EventForm