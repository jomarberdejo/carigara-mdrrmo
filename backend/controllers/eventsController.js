
const moment= require('moment')
const validator = require('validator')
const connection = require('../dbConfig/db');

const getOneEvent = async (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT 
        event_id,
        type,
         
        location,
        description,
        start_date,
        end_date,
        link,
        created_at,
        FROM events WHERE event_id  = ${Number(id)}
    `;

    connection.query(sql, (error, result) => {
        if (error) {
            res.json(error);
        } else {
            result.forEach((event) => {
                event.created_at = moment(event.created_at).fromNow();
            });
            res.json(result);
        }
    });
};






const getAllEvents = (req, res) => {
    const sql = `SELECT
        event_id,
        type,
        location,
        description,
        start_date,
        end_date,
        link,
        CASE
            WHEN start_date > NOW() AND start_date <= end_date THEN 'upcoming'
            WHEN start_date < NOW() AND end_date < NOW() THEN 'past'
            WHEN start_date <= NOW() AND end_date >= NOW() THEN 'happening now'
            ELSE 'unknown'
        END AS status
    FROM events ORDER BY start_date DESC`;

    const result = connection.query(sql, (error, result) => {
        if (error) {
            res.json(error);
        } else {
            result.forEach((event) => {
                event.start_date = moment(event.start_date).format('MMM, DD, YYYY h:mm A');
                event.end_date = moment(event.end_date).format('MMM, DD, YYYY h:mm A');
            });

            res.json(result);
        }
    });
};


const createEvent = async (req, res) => {
    const { type, location, description, start_date, end_date, link, user_id } = req.body;

    try {
        // Add validation to check if start_date is greater than end_date
        if (start_date > end_date) {
            return res.status(400).json({ error: 'Start date cannot be greater than end date' });
        }

        const sql = `INSERT INTO events (type, location, description, start_date, end_date, link, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [type, location, description, start_date, end_date, link, user_id];

        connection.query(sql, values, (error, result) => {
            if (error) {
                return res.json(error);
            }
            res.json({ message: `Event created successfully`, result });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



const updateEvent = async (req, res) => {
    const { type, location, description, link  } = req.body;
    const { id } = req.params;

    try{
        if (!type || !description || !location || !user_id) {
            return res.status(400).json({ error: 'All fields must be filled' });
          }
          
        const sql = `
        UPDATE events 
        SET type = ?, location = ?, description = ?, link = ?, user_id = ?
        WHERE event_id = ?`;

    const values = [type,  location, description, link, Number(id)];

    connection.query(sql, values, (error, result) => {
        if (error) {
            res.json({
                error: error.message
            });
        } else {
            res.json({
                message: `Event updated succesfully.`,
                result
            });
        }
    });
    }
     catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
}
};

const deleteEvent = async(req, res) => {
    const {id} = req.params;
    const sql = `DELETE FROM events WHERE event_id = ?`;

    const values = [Number(id)]
    connection.query(sql,values, (error,  result) => {
        if (error){
            res.json({
                error: error.message
            })
        }
        else{
            res.json({
                message: "Event deleted successfully", result
            })
        }
    })
}

module.exports = {
    getAllEvents,
    getOneEvent,

    createEvent,
    deleteEvent,
    updateEvent,
    
    
}