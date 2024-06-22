const mongoose = require('mongoose');
const argon2 = require('argon2');
const validator = require('validator');

const Schema = mongoose.Schema;

const specialistSchema = new Schema({
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
  specialities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Speciality' }]
});

// static signup method
specialistSchema.statics.signup = async function(email, password, firstName, lastName, phone, specialities) {
  // validation
  if (!email || !password || !firstName || !lastName || !phone) {
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

  const specialist = await this.create({ email, password: hash, firstName, lastName, phone, specialities });

  // Populate specialities
  await specialist.populate('specialities').execPopulate();

  return specialist;
}

// static login method
specialistSchema.statics.login = async function(email, password) {
  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  const specialist = await this.findOne({ email }).populate('specialities');
  if (!specialist) {
    throw Error('Incorrect email');
  }

  const match = await argon2.verify(specialist.password, password);
  if (!match) {
    throw Error('Incorrect password');
  }

  return specialist;
}

module.exports = mongoose.model('Specialist', specialistSchema);
