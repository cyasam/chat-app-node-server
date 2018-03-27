const router = require('express').Router();
const passport = require('passport');
const multer = require('multer');
const { getProfile, saveProfile } = require('../controller/apiController');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/profile', passport.authenticate('jwt', { session: false }), getProfile);

router.post('/profile/save', [passport.authenticate('jwt', { session: false }), upload.single('profileImage')], saveProfile);

module.exports = router;
