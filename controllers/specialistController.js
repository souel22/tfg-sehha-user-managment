const Specialist = require('../models/specialistModel');
const Speciality = require('../models/specialityModel');
const createToken = require('../utils/createToken');
const {getChannel} = require('../utils/rabbitmq');

const privateKey = process.env.PRIVATE_KEY;
const passphrase = process.env.PASSPHRASE;
const exp = process.env.EXP;

// login a specialist
const loginSpecialist = async (req, res) => {
  const {email, password} = req.body;

  try {
    const specialist = await Specialist.login(email, password);
    const payload = {
      id: specialist._id,
      email: specialist.email,
      role: "specialist"
    }

    // create a token
    const token = createToken(payload, privateKey, passphrase, exp);


    res.status(200).json({ specialist: {
      id: specialist._id,
      email: specialist.email,
      firstName: specialist.firstName,
      lastName: specialist.lastName,
      phone: specialist.phone,
      specialities: specialist.specialities
    }, token });
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

// signup a specialist
const signupSpecialist = async (req, res) => {
  const {email, password, firstName, lastName, phone, specialities} = req.body;

  try {
    const specialist = await Specialist.signup(email, password, firstName, lastName, phone, specialities);
    const payload = {
      id: specialist._id,
      email: specialist.email,
      role: "specialist"
    }

    // create a token
    const token = createToken(payload, privateKey, passphrase, exp);

    const specialistData = {
      id: specialist._id,
      email: specialist.email,
      firstName: specialist.firstName,
      lastName: specialist.lastName,
      phone: specialist.phone,
      specialities: specialist.specialities
    }

    res.status(200).json({ token, specialist: specialistData });
    const channel = await getChannel();
    channel.assertQueue('specialist_created');
    channel.sendToQueue('specialist_created', Buffer.from(JSON.stringify(specialistData)));

  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

const getSpecialities = async (req, res) => {
  try {
    const specialities = await Speciality.find()
    res.status(200).json(specialities);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

module.exports = { signupSpecialist, loginSpecialist, getSpecialities };
