const validator = require('validator')
const connection = require('../dbConfig/db');

const getAllReports = (req, res) => {
    const sql = `
    SELECT 
    r.report_id,
    r.severity, 
    r.description, 
    r.location,
    r.status,
    r.file_path,
    DATE_FORMAT(r.reported_at, '%Y-%m-%d %H:%i:%s') AS reported_at, 
    u.firstname,
    u.lastname
FROM 
    reports AS r
JOIN 
    users AS u ON r.user_id = u.user_id
`;

    connection.query(sql, (error, result) => {
        if (error) {
            res.json(error);
        } else {
            res.json(result);
        }
    });
}

const getOneReport = (req, res) => {
    const {id} = req.params;
    const sql = `
    SELECT 
    r.report_id,
    r.severity, 
    r.description, 
    r.location,
    r.status,
    r.file_path,
    DATE_FORMAT(r.reported_at, '%Y-%m-%d %H:%i:%s') AS reported_at, 
    r.user_id, 
    u.firstname,
    u.lastname
FROM 
    reports AS r
JOIN 
    users AS u ON r.user_id = u.user_id WHERE report_id = ${Number(id)}
`;

    connection.query(sql, (error, result) => {
        if (error) {
            res.json(error);
        } else {
            res.json(result);
        }
    });
}


const addReport = (req, res) => {
    const { severity, description, location, status, user_id } = req.body;
    const file = req.file;
    
    try{
        if (!severity || !description || !location || !status) {
            return res.status(400).json({ error: 'All required fields must be filled' });
          } 
        const validSeverity = ['Uncategorized', 'Mild', 'Moderate', 'Severe']
        const validStatus = ['Ongoing', 'Pending', 'Resolved']

        if (!validSeverity.includes(severity)){
            return res.status(400).json({ error: 'Please choose available options for severity' });
        }

        if (!validStatus.includes(status)){
            return res.status(400).json({ error: 'Please choose available options for status' });
        }

        const file_path = file ? file.path : null;
  
        const sql =
        'INSERT INTO reports (severity, description, location, status, file_path, user_id) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [severity, description, location, status, file_path, user_id];
    
        connection.query(sql, values, (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        } else {
            res.status(200).json({ message: 'Reported incident updated successfully', result });
        }
        });
     }
     catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
    
  };
  

const deleteReport = (req, res) => {
    const {id} = req.params;
    const sql = `DELETE FROM reports WHERE report_id = ?`;
    values= [Number(id)]

    connection.query(sql, values, (error, result) => {
        if (error){
            res.json({
                error: error.message
            })
        }
        else{
            res.json({
                message: "Reported incident deleted successfully", result
            })
        }
    })
}

const updateReport = (req, res) => {
    const { severity, description, location, status } = req.body;
    const { id } = req.params;
    try{
        if (!severity || !description || !location || !status) {
            return res.status(400).json({ error: 'All required fields must be filled' });
          } 
        const validSeverity = ['Uncategorized', 'Mild', 'Moderate', 'Severe']
        const validStatus = ['Ongoing', 'Pending', 'Resolved']

        if (!validSeverity.includes(severity)){
            return res.status(400).json({ error: 'Please choose available options for severity' });
        }

        if (!validStatus.includes(status)){
            return res.status(400).json({ error: 'Please choose available options for status' });
        }

          const sql = `
          UPDATE reports 
          SET severity = ?, description = ?, location = ?, status = ?
          WHERE report_id = ?`;
  
      const values = [severity, description, location, status, Number(id)];
  
      connection.query(sql, values, (error, result) => {
          if (error) {
              res.json(error);
          } else {
              res.json({
                  message: "Reported incident updated successfully",
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


module.exports = {
    getAllReports,
    getOneReport,
addReport,
deleteReport,
updateReport
}