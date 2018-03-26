const router = require('express').Router();
const passport = require('passport');
const User = require('../model/userModel');

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (!user) return res.send({ status: false, message: 'User not found.' });

    const response = {
      name: user.name,
      email: user.email,
      activated: user.activated
    };

    return res.send({ status: true, ...response });
  });
});

router.post('/profile/save', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { user, body } = req;

  User.findById(user._id, (err, currentUser) => {
    if (!currentUser) return res.send({ status: false, message: 'User not found.' });

    const UserSchema = new User(currentUser);

    return UserSchema.comparePassword(body.oldPassword).then(async (ok) => {
      if (!ok) return res.send({ status: false, message: 'Password is wrong.' });

      if (body.password) {
        body.password = await UserSchema.createHashPassword(body.password);
      }

      return User.findByIdAndUpdate(user._id, { ...body }, { new: true }, (error, haveUser) => {
        if (error) return res.status(500).send({ status: false, message: 'Internal Server Error' });
        if (!haveUser) return res.status(422).send({ status: false, message: 'No Authorized Process.' });

        const response = {
          name: haveUser.name,
          email: haveUser.email,
          activated: haveUser.activated
        };

        return res.send({ status: true, ...response, message: 'Profile saved.' });
      });
    });
  });
});

module.exports = router;
