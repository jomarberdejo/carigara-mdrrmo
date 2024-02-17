
const express = require('express')
const router = express.Router();
const multer = require('multer');



const { createUser, updateUser, deleteUser, getOneUser, getAllUsers } = require('../controllers/usersController');


const admin = require('../firebaseAdminCredentials/firebaseAdminCredentials');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



//GET ALL users
router.get('/' , getAllUsers)

//GET SINGLE users
router.get('/:id' , getOneUser)

//ADD NEW users
router.post('/' , createUser)

//DELETE users
router.delete('/:id' , deleteUser)




router.patch('/:id', upload.single('profileImagePath'), async (req, res) => {
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
  
        req.body.profileImagePath = fileUrl;
      } else {
        req.body.profileImagePath = null;
      }
  
   
      updateUser(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


module.exports = router
