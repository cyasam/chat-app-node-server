const router = require('express').Router();
const passport = require('passport');
const multer = require('multer');
const { getProfile, getUsersList, saveProfile } = require('../controller/apiController');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/profile', passport.authenticate('jwt', { session: false }), getProfile);

router.get('/userlist', passport.authenticate('jwt', { session: false }), getUsersList);

router.post('/profile/save', [passport.authenticate('jwt', { session: false }), upload.single('profileImage')], saveProfile);

module.exports = router;
