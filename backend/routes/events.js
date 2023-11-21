
const express = require('express')
const router = express.Router();

const { createEvent, updateEvent, deleteEvent,getOneEvent , getAllEvents } = require('../controllers/eventsController');


//GET ALL events
router.get('/' , getAllEvents)

//GET SINGLE events
router.get('/:id' , getOneEvent)

//ADD NEW events
router.post('/' , createEvent)

//DELETE events
router.delete('/:id' , deleteEvent)


//UPDATE events
router.patch('/:id' , updateEvent)





module.exports = router
