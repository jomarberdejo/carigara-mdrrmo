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
    u.firstname
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
    u.firstname
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
    console.log('File details:', file);
    
    console.log(req.body)
    
    const defaultSeverity = severity === 'undefined' ? 'Uncategorized' : severity;
    const defaultStatus = status === '' ? 'Ongoing' : status;
  
    const sql =
      'INSERT INTO reports (severity, description, location, status, file_path,  user_id) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [defaultSeverity, description, location, defaultStatus, file.path, user_id];
  
    connection.query(sql, values, (error, result) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json({ message: 'Report added successfully', result });
      }
    });
  };
  

const deleteReport = (req, res) => {
    const {id} = req.params;
    const sql = `DELETE FROM reports WHERE report_id = ${Number(id)}`;


    connection.query(sql, (error, result) => {
        if (error){
            res.json({
                error: error.message
            })
        }
        else{
            res.json({
                message: "Report deleted successfully", result
            })
        }
    })
}

const updateReport = (req, res) => {
    const {severity, description, location, status} = req.body;
    const {id} = req.params

    const sql = `UPDATE reports SET severity= '${severity}', description= '${description}', location = '${location}', status = '${status}' WHERE report_id = ${Number(id)}`

    connection.query(sql, (error, result) => {
        if (error){
            res.json({
                error: error.message
            })
        }
        else{
            res.json({
                message: "Report updated successfully", result
            })
        }
    })
}

module.exports = {
    getAllReports,
    getOneReport,
addReport,
deleteReport,
updateReport
}