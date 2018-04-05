const jimp = require('jimp');
const { UPLOADS_FOLDER, UPLOADS_URL } = require('../config/consts');
const User = require('../model/userModel');

const splitFileName = (filename) => {
  const fileNameSplit = filename.split('.');
  const name = fileNameSplit[0];
  const ext = fileNameSplit[1];

  return { name, ext };
};

const profileImageProcess = image => jimp.read(image.path).then((profileImage) => {
  const { name, ext } = splitFileName(image.filename);
  profileImage.cover(70, 70).write(`${UPLOADS_FOLDER}/images/${name}-thumb.${ext}`);
  return true;
}).catch((err) => {
  throw err;
});

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

      const users = usersList.map((user) => {
        const { name, ext } = user.profileImageName ? splitFileName(user.profileImageName) : {};
        return {
          id: user.id,
          name: user.name,
          nickname: user.nickname,
          email: user.email,
          profileImage: user.profileImageName ? `${UPLOADS_URL}/images/${name}-thumb.${ext}` : null
        };
      });

      return res.send({ status: true, users });
    });
  },
  saveProfile(req, res) {
    const { user, body } = req;
    const profileImage = req.file;

    User.findById(user._id, (err, currentUser) => {
      if (err) return res.status(500).send({ status: false, message: 'Internal Server Error' });
      if (!currentUser) return res.send({ status: false, message: 'User not found.' });
      if (!body.oldPassword) return res.send({ status: false, message: 'Provide password.' });

      const UserSchema = new User(currentUser);

      return UserSchema.comparePassword(body.oldPassword).then(async (ok) => {
        if (!ok) return res.send({ status: false, message: 'Password is wrong.' });

        if (body.password) {
          body.password = await UserSchema.createHashPassword(body.password);
        }

        const saveData = {
          ...body,
        };

        if (profileImage) {
          saveData.profileImageName = profileImage.filename;
        }

        return User.findByIdAndUpdate(user._id, saveData, { new: true }, (error, haveUser) => {
          if (error) return res.status(500).send({ status: false, message: 'Internal Server Error' });
          if (!haveUser) return res.status(422).send({ status: false, message: 'No Authorized Process.' });

          const response = {
            nickname: haveUser.nickname,
            name: haveUser.name,
            email: haveUser.email,
            activated: haveUser.activated
          };

          if (profileImage && !profileImageProcess(profileImage)) return res.status(500).send({ status: false, message: 'Internal Server Error' });

          return res.send({ status: true, ...response, message: 'Profile saved.' });
        });
      });
    });
  },
  checkNickname(req, res) {
    const { nickname } = req.query;
    User.findOne({ nickname }, (err, haveNickname) => {
      if (err) return res.status(500).send({ status: false, message: 'Internal Server Error' });
      if (haveNickname) return res.send({ status: false, message: 'This is taken.' });

      return res.send({ status: true, message: 'You can take this nickname.' });
    });
  }
};

module.exports = apiController;
