const mongoose = require('mongoose');
const argon2 = require('argon2');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true
  }
});

// static signup method
userSchema.statics.signup = async function(email, password, firstName, lastName, phone, dateOfBirth, gender) {
  // validation
  if (!email || !password || !firstName || !lastName || !phone || !dateOfBirth || !gender) {
    throw Error('All fields must be filled');
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid');
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough');
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error('Email already in use');
  }

  const hash = await argon2.hash(password);

  const user = await this.create({ email, password: hash, firstName, lastName, phone, dateOfBirth, gender });

  return user;
};

// static login method
userSchema.statics.login = async function(email, password) {
  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Incorrect email');
  }

  const match = await argon2.verify(user.password, password);
  if (!match) {
    throw Error('Incorrect password');
  }

  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
