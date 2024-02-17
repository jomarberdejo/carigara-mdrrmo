const express = require('express');
const multer = require('multer');

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


const admin = require('../firebaseAdminCredentials/firebaseAdminCredentials');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



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
