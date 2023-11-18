
const express = require('express')



const multer = require('multer');
const path = require('path');
const router = express.Router();

const { getAllReports, getOneReport, addReport, updateReport, deleteReport } = require('../controllers/reportsController');


router.get('/', getAllReports)

//GET SINGLE reports
router.get('/:id' , getOneReport)





const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/reports/'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const fileFilter = (req, file, cb) => {
    if (req.body.file_path !== 'null') {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'];
  
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
      } else {
        cb(null, false); // Reject the file
      }
    } else {
      cb(null, false); // Reject the file
    }
  };
  
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  });
  

//ADD REPORTS
router.post('/', upload.single('file_path'), addReport)

//DELETE reports
router.delete('/:id' , deleteReport)

//UPDATE reports
router.patch('/:id' , updateReport)






module.exports = router
