const User = require('../model/userModel');

const apiController = {
  getProfile(req, res) {
    User.findById(req.user.id, (err, user) => {
      if (!user) return res.send({ status: false, message: 'User not found.' });

      const response = {
        nickname: user.nickname,
        name: user.name,
        email: user.email,
        activated: user.activated
      };

      return res.send({ status: true, ...response });
    });
  },
  getUsersList(req, res) {
    User.find({}, (err, usersList) => {
      if (err) return res.status(500).send({ status: false, message: 'Internal Server Error' });
      if (!usersList) return res.send({ status: false, message: 'Users not found.' });

      const users = usersList.map(user => ({
        id: user.id,
        name: user.name,
        nickname: user.nickname,
        email: user.email
      }));

      return res.send({ status: true, users });
    });
  },
  saveProfile(req, res) {
    const { user, body } = req;

    User.findById(user._id, (err, currentUser) => {
      if (err) return res.status(500).send({ status: false, message: 'Internal Server Error' });
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
            nickname: haveUser.nickname,
            name: haveUser.name,
            email: haveUser.email,
            activated: haveUser.activated
          };

          return res.send({ status: true, ...response, message: 'Profile saved.' });
        });
      });
    });
  }
};

module.exports = apiController;
