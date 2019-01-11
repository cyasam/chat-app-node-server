const router = require('express').Router();
const passport = require('passport');
const {
  register,
  login,
  registerComplete
} = require('../controller/authController');

router.post(
  '/login',
  passport.authenticate('local', {
    session: false
  }),
  login
);
router.post('/register', register);
router.put('/register/complete', registerComplete);

module.exports = router;
