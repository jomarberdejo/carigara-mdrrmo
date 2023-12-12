const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');

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

const firebaseCredentials = {

    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
  }
  



admin.initializeApp({
  credential: admin.credential.cert(firebaseCredentials),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
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
