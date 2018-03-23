const router = require('express').Router();
const passport = require('passport');
const User = require('../model/userModel');

router.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.find({}, (err, list) => {
    if (list) return res.send({ status: true, list });

    return res.send({ status: false, message: 'User not found.' });
  });
});

router.get('/user/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (user) return res.send({ status: true, data: user });

    return res.send({ status: false, message: 'User not found.' });
  });
});

module.exports = router;
