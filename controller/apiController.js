const {
  UPLOADS_URL
} = require('../config/consts');
const {
  splitFileName,
  profileImageProcess
} = require('../helpers');
const User = require('../model/userModel');

const apiController = {
  getProfile(req, res) {
    User.findById(req.user.id, (err, user) => {
      if (!user) return res.send({
        status: false,
        message: 'User not found.'
      });

      const {
        profileImageName
      } = req.user;
      const {
        name,
        ext
      } = profileImageName ? splitFileName(profileImageName) : {};

      const response = {
        nickname: user.nickname,
        name: user.name,
        email: user.email,
        activated: user.activated,
        profileImage: profileImageName ? `${UPLOADS_URL}/images/${name}-thumb.${ext}` : null
      };

      return res.send({
        status: true,
        ...response
      });
    });
  },
  getUsersList(req, res) {
    User.find({}, (err, usersList) => {
      if (err) {
        return res.status(500).send({
          status: false,
          message: 'Internal Server Error'
        });
      }
      if (!usersList) {
        return res.send({
          status: false,
          message: 'Users not found.'
        });
      }

      const users = usersList.map((user) => {
        const {
          name,
          ext
        } = user.profileImageName ? splitFileName(user.profileImageName) : {};
        return {
          id: user.id,
          name: user.name,
          nickname: user.nickname,
          email: user.email,
          profileImage: user.profileImageName ? `${UPLOADS_URL}/images/${name}-thumb.${ext}` : null
        };
      });

      return res.send({
        status: true,
        users
      });
    });
  },
  saveProfile(req, res) {
    const {
      user,
      body
    } = req;
    const profileImage = req.file;

    User.findById(user._id, async (err, currentUser) => {
      if (err) return res.status(500).send({
        status: false,
        message: 'Internal Server Error'
      });
      if (!currentUser) return res.send({
        status: false,
        message: 'User not found.'
      });

      const UserSchema = new User(currentUser);

      if (body.password) {
        body.password = await UserSchema.createHashPassword(body.password);
      }

      const saveData = {
        ...body,
      };

      if (profileImage) {
        saveData.profileImageName = profileImage.filename;
      }

      return User.findByIdAndUpdate(user._id, saveData, {
        new: true
      }, (error, haveUser) => {
        if (error) return res.status(500).send({
          status: false,
          message: 'Internal Server Error'
        });
        if (!haveUser) return res.status(422).send({
          status: false,
          message: 'No Authorized Process.'
        });

        const {
          profileImageName
        } = haveUser;
        const {
          name,
          ext
        } = profileImageName ? splitFileName(profileImageName) : {};

        const response = {
          nickname: haveUser.nickname,
          name: haveUser.name,
          email: haveUser.email,
          activated: haveUser.activated,
          profileImage: profileImageName ? `${UPLOADS_URL}/images/${name}-thumb.${ext}` : null
        };

        if (profileImage && !profileImageProcess(profileImage)) return res.status(500).send({
          status: false,
          message: 'Internal Server Error'
        });

        return res.send({
          status: true,
          ...response,
          message: 'Profile saved.'
        });
      });
    });
  },
  checkNickname(req, res) {
    const {
      nickname
    } = req.query;
    User.findOne({
      nickname
    }, (err, haveNickname) => {
      if (err) return res.status(500).send({
        status: false,
        message: 'Internal Server Error'
      });
      if (haveNickname) return res.send({
        status: false,
        message: 'This is taken.'
      });

      return res.send({
        status: true,
        message: 'You can take this nickname.'
      });
    });
  }
};

module.exports = apiController;