const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { getUserProfile, updateUserProfile, changePassword, updateProfilePhoto, getAllUsers } = require('../controllers/userController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.put('/profile', authenticateUser, updateUserProfile);
router.put('/password', authenticateUser, changePassword);
router.put('/profile/photo', authenticateUser, upload.single('photoDeProfil'), updateProfilePhoto);
router.get('/users', authenticateUser, getAllUsers);
router.get('/', authenticateUser, getUserProfile);

module.exports = router;
