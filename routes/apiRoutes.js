const router = require('express').Router();
const passport = require('passport');
const multer = require('multer');
const { UPLOADS_FOLDER } = require('../config/consts');
const {
  getProfile,
  getUsersList,
  saveProfile,
  checkNickname
} = require('../controller/apiController');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${UPLOADS_FOLDER}/images`);
    },
    filename: (req, file, cb) => {
      const fileNameSplit = file.originalname.split('.');
      const name = fileNameSplit[0];
      const ext = fileNameSplit[1];
      cb(null, `${name}-${Date.now()}.${ext}`);
    }
  })
});

router.get('/profile', passport.authenticate('jwt', { session: false }), getProfile);

router.get('/userlist', passport.authenticate('jwt', { session: false }), getUsersList);

router.post('/profile/save', [passport.authenticate('jwt', { session: false }), upload.single('profileImage')], saveProfile);

router.get('/checknickname', checkNickname);

module.exports = router;
