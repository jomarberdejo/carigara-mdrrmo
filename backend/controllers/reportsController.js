const connection = require('../dbConfig/db');

const getAllReports = (req, res) => {
    const sql = `
    SELECT 
    r.report_id,
    r.severity, 
    r.description, 
    r.location,
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
    const { severity, description, userId } = req.body;
    const file = req.file;
    console.log('File details:', file);

    const sql = 'INSERT INTO reports (severity, description, user_id, file_path) VALUES (?, ?, ?, ?)';
    const values = [severity, description, userId, file.path];

    connection.query(sql, values, (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(200).json({ message: 'Report added successfully', result });
        }
    });
}

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
    const {severity: severityValue, description:descriptionValue} = req.body;
    const {id} = req.params

    const sql = `UPDATE reports SET severity= '${severityValue}', description= '${descriptionValue}' WHERE report_id = ${Number(id)}`

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