const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { accountActivationMail } = require('../config/mailer-setup');
const { token: { secretKey } } = require('../config/keys');
const { AUTH_EXPIRES_IN } = require('../config/consts');
const User = require('../model/userModel');

const createToken = (user) => {
  const payload = {
    sub: user.id
  };
  return jwt.sign(payload, secretKey, { expiresIn: AUTH_EXPIRES_IN });
};

const createRandomBytes = (len = 64) => {
  const buf = crypto.randomBytes(len);
  if (!buf) return false;

  return buf.toString('hex').slice(0, len);
};

const authController = {
  register(req, res) {
    if (!req.body) return res.sendStatus(400);

    const { name, email, password } = req.body;
    if (!email || !password) return res.status(422).send({ status: false, message: 'Provide email and password.' });
    if (!name) return res.status(422).send({ status: false, message: 'Provide your name.' });

    return User.findOne(
      {
        email
      },
      (err, haveUser) => {
        if (err) return res.status(500).send({ status: false, message: 'Internal server Error' });
        if (haveUser) return res.status(422).send({ status: false, message: 'Email is in use' });

        const activationKey = createRandomBytes();

        // Send mail
        return accountActivationMail(email, name, activationKey).then(() => {
          const newUser = new User({ ...req.body, activationKey });

          return newUser.save((error) => {
            if (error) return res.status(500).send({ status: false, message: 'Internal server Error' });

            return res.status(200).send({ status: true, message: 'Activation mail has been send. Please check your email and activate your account.' });
          });
        }).catch(() => res.status(422).send({ status: false, message: 'Activation mail can\'t send.' }));
      }
    );
  },
  registerComplete(req, res) {
    const { key } = req.body;
    if (!key) return res.status(401).send({ status: false, message: 'No Authorized Process.' });

    return User.findOneAndUpdate({
      activationKey: key
    }, { activated: true }, (error, haveUser) => {
      if (error) return res.status(500).send({ status: false, message: 'Internal server Error' });
      if (!haveUser) return res.status(422).send({ status: false, message: 'No Authorized Process.' });

      return res.status(200).send({ status: true, message: 'Activation complete. Have fun!' });
    });
  },
  login(req, res) {
    if (!req.user) return res.status(401);

    const token = createToken(req.user);
    const info = {
      activated: req.user.activated,
      email: req.user.email,
      name: req.user.name,
      nickname: req.user.nickname,
    };

    return res.status(200).send({
      status: true,
      token,
      info,
      message: 'Login successful.',
      activated: req.user.activated
    });
  }
};

module.exports = authController;
