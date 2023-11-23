
const express = require('express')



const multer = require('multer');
const path = require('path');
const router = express.Router();

const { getAllReports, getOneReport, addReport, updateReport, deleteReport, getAllUserReports, updateReportStatus } = require('../controllers/reportsController');
const requireAuth = require('../middleware/requireAuth')

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
      cb(null, true); 
    } else {
      cb(null, false); 
    }
  } else {
    cb(null, false); 
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

//require auth for all routes
router.use(requireAuth)


router.get('/', getAllReports)

router.get('/user/:id', getAllUserReports)

//GET SINGLE reports
router.get('/:id' , getOneReport)

//ADD REPORTS
router.post('/', upload.single('file_path'), addReport)

//DELETE reports
router.delete('/:id' , deleteReport)

//UPDATE reports
router.patch('/:id' , updateReport)



//UPDATE reports
router.patch('/status/:id' , updateReportStatus)




  









module.exports = router
