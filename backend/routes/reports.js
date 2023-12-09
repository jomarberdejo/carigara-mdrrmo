const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('../mdrrmostorage-firebase-adminsdk-k59o9-f04915f7a3.json');
const router = express.Router();

const {
  getAllReports,
  getOneReport,
  addReport,
  updateReport,
  deleteReport,
  getAllUserReports,
  updateReportStatus,
} = require('../controllers/reportsController');
const requireAuth = require('../middleware/requireAuth');

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

// Require auth for all routes
router.use(requireAuth);

// GET ALL reports
router.get('/', getAllReports);

// GET ALL User reports
router.get('/user/:id', getAllUserReports);

// GET SINGLE reports
router.get('/:id', getOneReport);

// DELETE reports
router.delete('/:id', deleteReport);

// UPDATE reports
router.patch('/:id', updateReport);

// UPDATE reports
router.patch('/status/:id', updateReportStatus);

router.post('/', upload.single('file_path'), async (req, res) => {
  const file = req.file;

  try {
    if (file) {
      const filename = Date.now().toString();
      const bucket = admin.storage().bucket();
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

      const fileExtension = file.mimetype.split('/')[1];
      const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
        fileUpload.name
      )}?alt=media&type=${fileExtension}`;

      
      await new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
        stream.end(file.buffer);
      });

      req.body.filePath = fileUrl;
    } else {
      req.body.filePath = null;
    }

 
    addReport(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
