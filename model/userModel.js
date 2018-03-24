const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { bcrypt: { saltRounds } } = require('../config/keys');

const { Schema } = mongoose;

const UserSchema = new Schema({
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
  password: { type: String, required: true },
  activated: { type: Boolean, default: false, required: true },
  activationKey: { type: String, required: true }
});

UserSchema.virtual('id').get(function id() {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true
});

UserSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(this.password, password).then(res => res);
};

UserSchema.pre('save', function preSave(next) {
  const { password } = this;

  bcrypt.genSalt(saltRounds)
    .then(salt => salt).then((salt) => {
      bcrypt.hash(password, salt).then((hash) => {
        this.password = hash;

        next();
      }).catch(() => next({ error: 'hash error' }));
    })
    .catch(() => next({ error: 'salt error' }));
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
