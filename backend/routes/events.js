
const express = require('express')
const router = express.Router();

const { createEvent, deleteEvent , getAllEvents } = require('../controllers/eventsController');
const requireAuth = require('../middleware/requireAuth')

//require auth for all routes
router.use(requireAuth)

//GET ALL events
router.get('/' , getAllEvents)



//ADD NEW events
router.post('/' , createEvent)

//DELETE events
router.delete('/:id' , deleteEvent)


// //UPDATE events
// router.patch('/:id' , updateEvent)





module.exports = router
