const moment = require('moment');
const connection = require('../dbConfig/db');

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
        u.lastname
      FROM 
        reports AS r
      JOIN 
        users AS u ON r.user_id = u.user_id
      WHERE 
        r.user_id = ?
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
              result.forEach((report) => {
                  report.reported_at = moment(report.reported_at).format('YYYY/MM/DD hh:mm A');
              });
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
    r.reported_at, 
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
            result.forEach((report) => {
                report.reported_at = moment(report.reported_at).fromNow();
            });
            res.json(result);
        }
    });
}


const addReport = (req, res) => {
    const { severity, description, location, status, user_id } = req.body;
    const file = req.file;
    
    try{
        console.log(file)
     
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

const updateReportStatus = (req, res) => {
    const { id } = req.params;
    const status = "Resolved"
    try{
   
        

          const sql = `
          UPDATE reports 
          SET status = ? WHERE report_id = ?`;
  
      const values = [ status, Number(id)];
  
      connection.query(sql, values, (error, result) => {
          if (error) {
              res.json(error);
          } else {
              res.json({
                  message: "Reported incident status changed to Resolved.",
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