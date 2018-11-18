const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {
  bcrypt: {
    saltRounds
  }
} = require('../config/keys');

const {
  Schema
} = mongoose;

const UserSchema = new Schema({
  nickname: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  activated: {
    type: Boolean,
    default: false,
    required: true
  },
  activationKey: {
    type: String,
    required: true
  },
  profileImageName: {
    type: String
  }
});

UserSchema.virtual('id').get(function id() {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true
});

UserSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password).then(res => res);
};

UserSchema.methods.createHashPassword = function createHashPassword(password) {
  return bcrypt.genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt).then(hash => hash).catch(() => 'hash error'))
    .catch(() => 'salt error');
};

UserSchema.pre('save', function preSave(next) {
  const {
    password
  } = this;

  this.createHashPassword(password).then((hash) => {
    this.password = hash;

    next();
  }).catch(error => next(error));
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;