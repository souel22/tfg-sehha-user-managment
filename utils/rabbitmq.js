const amqp = require('amqplib/callback_api');

// RabbitMQ URL
const CLOUDAMQP_URL = process.env.CLOUDAMQP_URL;

let channel = null;

const connectRabbitMQ = (callback) => {
  amqp.connect(CLOUDAMQP_URL, (err, conn) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    conn.createChannel((err, ch) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      channel = ch;
      callback();
    });
  });
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };
