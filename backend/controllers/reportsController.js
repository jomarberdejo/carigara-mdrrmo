const path = require('path');
const moment = require('moment');
const connection = require('../dbConfig/db');
const admin = require('firebase-admin')
const getAllUserReports = (req, res) => {
    const { id } = req.params;

    const sql = `
      SELECT 
        r.report_id,
        r.severity, 
        r.description, 
        r.location,
        r.status,
        r.file_path,
        r.reported_at,
        u.firstname,
        u.lastname,
        u.profileImagePath
      FROM 
        reports AS r
      JOIN 
        users AS u ON r.user_id = u.user_id
      WHERE 
        r.user_id = ? ORDER BY reported_at DESC
    `;

    connection.query(sql, [Number(id)], (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            result.forEach((report) => {
                report.reported_at = moment(report.reported_at).fromNow();
            });
            res.status(200).json(result);
        }
    });
};



const getAllReports = (req, res) => {
    const sql = `
      SELECT 
      r.report_id,
      r.severity, 
      r.description, 
      r.location,
      r.status,
      r.file_path,
      r.reported_at,
      u.firstname,
      u.lastname,
      u.profileImagePath
  FROM 
      reports AS r
  JOIN 
      users AS u ON r.user_id = u.user_id ORDER BY reported_at DESC
  `;

    connection.query(sql, (error, result) => {
        if (error) {
            res.json(error);
        } else {
            //   result.forEach((report) => {
            //       report.reported_at = moment(report.reported_at).format('YYYY/MM/DD hh:mm A');
            //   });
            result.forEach((report) => {
                report.reported_at = moment(report.reported_at).format('MMM, DD, YYYY h:mm A');

            })
            
            res.json(result);
        }
    });
}





const getOneReport = (req, res) => {
    const { id } = req.params;
    const sql = `
    SELECT 
    r.report_id,
    r.severity, 
    r.description, 
    r.location,
    r.status,
    r.file_path,
    r.reported_at, 
    r.user_id, 
    u.firstname,
    u.lastname,
    u.profileImagePath
FROM 
    reports AS r
JOIN 
    users AS u ON r.user_id = u.user_id WHERE report_id = ${Number(id)}
`;

    connection.query(sql, (error, result) => {
        if (error) {
            res.json(error);
        } else {
            result.forEach((report) => {
                report.reported_at = moment(report.reported_at).fromNow();
            });
            
            res.json(result);
        }
    });
}


const addReport = (req, res) => {
    const { severity, description, location, status, user_id, filePath } = req.body;

    try {
        // console.log(filePath)

        if (!severity || !description || !location || !status) {
            return res.status(400).json({ error: 'All required fields must be filled' });
        }
        const validSeverity = ['Uncategorized', 'Mild', 'Moderate', 'Severe']
        const validStatus = ['Ongoing', 'Pending', 'Resolved']

        if (!validSeverity.includes(severity)) {
            return res.status(400).json({ error: 'Please choose available options for severity' });
        }

        if (!validStatus.includes(status)) {
            return res.status(400).json({ error: 'Please choose available options for status' });
        }

        const file_path = filePath ? filePath : null;


        const sql =
            'INSERT INTO reports (severity, description, location, status, file_path, user_id) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [severity, description, location, status, file_path, user_id];

        connection.query(sql, values, (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: error.message });
            } else {

                res.status(200).json({ message: 'Report submitted successfully', result });
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

};



const deleteReport = (req, res) => {
    const { id } = req.params;
    const sqlSelect = `SELECT file_path FROM reports WHERE report_id = ?`;
    const sqlDelete = `DELETE FROM reports WHERE report_id = ?`;
    const values = [Number(id)];

    connection.query(sqlSelect, values, (error, result) => {
        if (error) {
            return res.json({
                error: error.message,
            });
        } else {
            const filePath = result[0].file_path;

            connection.query(sqlDelete, values, (errorDelete, resultDelete) => {
                if (errorDelete) {
                    return res.json({
                        error: errorDelete.message,
                    });
                } else {
                    
                    if (filePath) {
                        const parsedUrl = new URL(filePath);
                        const fileName = path.basename(parsedUrl.pathname); 

                        const bucket = admin.storage().bucket();
                        const file = bucket.file(fileName);

                        file.delete().then(() => {
                            console.log(`File deleted successfully from Firebase Storage: ${fileName}`);
                        }).catch((errorDeleteStorage) => {
                            console.error(`Error deleting file from Firebase Storage: ${errorDeleteStorage}`);
                        });
                    }

                    return res.json({
                        message: 'Report deleted successfully',
                        result: resultDelete,
                    });
                }
            });
        }
    });
};

const updateReport = (req, res) => {
    const { severity, description, location, status } = req.body;
    const { id } = req.params;
    try {
        if (!severity || !description || !location || !status) {
            return res.status(400).json({ error: 'All required fields must be filled' });
        }
        const validSeverity = ['Uncategorized', 'Mild', 'Moderate', 'Severe']
        const validStatus = ['Ongoing', 'Pending', 'Resolved']

        if (!validSeverity.includes(severity)) {
            return res.status(400).json({ error: 'Please choose available options for severity' });
        }

        if (!validStatus.includes(status)) {
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
                    message: "Report updated successfully",
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

const updateReportStatus = (req, res) => {
    const { status } = req.body
    const { id } = req.params;

    try {



        const sql = `
          UPDATE reports 
          SET status = ? WHERE report_id = ?`;

        const values = [status, Number(id)];

        connection.query(sql, values, (error, result) => {
            if (error) {
                res.json(error);
            } else {
                res.json({
                    message: "Report status changed to Resolved.",
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
    getAllUserReports,
    getAllReports,

    getOneReport,
    addReport,
    deleteReport,
    updateReport,
    updateReportStatus
}