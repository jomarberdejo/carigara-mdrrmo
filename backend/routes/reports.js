
const express = require('express')



const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('../mdrrmostorage-firebase-adminsdk-k59o9-f04915f7a3.json');
const router = express.Router();

const { getAllReports, getOneReport, addReport, updateReport, deleteReport, getAllUserReports, updateReportStatus } = require('../controllers/reportsController');
const requireAuth = require('../middleware/requireAuth')


// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://mdrrmostorage.appspot.com',
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

//require auth for all routes
router.use(requireAuth)


router.get('/', getAllReports)

router.get('/user/:id', getAllUserReports)

//GET SINGLE reports
router.get('/:id' , getOneReport)

//DELETE reports
router.delete('/:id' , deleteReport)

//UPDATE reports
router.patch('/:id' , updateReport)



//UPDATE reports
router.patch('/status/:id' , updateReportStatus)

router.post('/', upload.single('file_path'), (req, res) => {
  const file = req.file;

  if (file){
     // Create a unique filename
  const filename = Date.now().toString();

  // Reference to the Firebase Storage bucket
  const bucket = admin.storage().bucket();

  // Upload the file to Firebase Storage
  const fileUpload = bucket.file(filename);

  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  stream.on('error', (error) => {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload file' });
  });

  const fileExtension = file.mimetype.split('/')[1]; // Extract file extension from mimetype

  // The file has been uploaded successfully
  // Now, you can update your database with the file path in Firebase Storage
  const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media&type=${fileExtension}`;

  req.body.filePath = fileUrl; // Assuming your database field is named 'file_path'
  
  // Call your addReport function here passing req.body
  addReport(req, res);
  stream.end(file.buffer);
  }
  else{
    req.body.filePath = null
    addReport(req, res);
  }
 
});





  









module.exports = router
