const User = require('../models/userModel');
const createToken = require('../utils/createToken');
const { getChannel } = require('../utils/rabbitmq');

const privateKey = process.env.PRIVATE_KEY;
const passphrase = process.env.PASSPHRASE;
const exp = process.env.EXP;

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    console.log(user);

    const payload = {
      id: user._id,
      email: user.email,
      role: "user"
    }
    // create a token
    const token = createToken(payload, privateKey, passphrase, exp);
    const userData = { id: user._id, email, firstName: user.firstName, lastName: user.lastName, phone: user.phone, dateOfBirth: user.dateOfBirth, gender: user.gender };

    // Send the token and user data in the response body
    res.status(200).json({ token, user: userData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// signup a user
const signupUser = async (req, res) => {
  const { email, password, firstName, lastName, phone, dateOfBirth, gender } = req.body;

  try {
    const user = await User.signup(email, password, firstName, lastName, phone, dateOfBirth, gender);
    const payload = {
      id: user._id,
      email: user.email,
      role: "user"
    }

    // create a token
    const token = createToken(payload, privateKey, passphrase, exp);

    const userData = { id: user._id, email, firstName, lastName, phone, dateOfBirth, gender };

    // Send the token and user data in the response body
    res.status(200).json({ token, user: userData });

    // Publish user data to RabbitMQ
    const channel = getChannel();
    console.log('Publishing user data to RabbitMQ');
    console.log(userData);
    console.log('------------------------------------------------------------');
    
    channel.assertQueue('user_created', { durable: true });
    channel.sendToQueue('user_created', Buffer.from(JSON.stringify(userData)));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { signupUser, loginUser };
