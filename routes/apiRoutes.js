const router = require('express').Router();
const passport = require('passport');
const User = require('../model/userModel');

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (!user) return res.send({ status: false, message: 'User not found.' });

    const data = {
      name: user.name,
      email: user.email,
      activated: user.activated
    };

    return res.send({ status: true, data });
  });
});

module.exports = router;
