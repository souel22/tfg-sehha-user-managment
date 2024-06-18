require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/routes')
const { connectRabbitMQ } = require('./utils/rabbitmq')
const cors = require('cors')

// express app
const app = express()

// Enable CORS for all routes
app.use(cors({
  origin: process.env.CORS_URL, // Allow requests from this origin
  credentials: true, // Allow cookies to be sent with requests
}));
// middleware
app.use(express.json())

// Handle preflight requests
app.options('*', cors());

app.use(process.env.AUTH_BASEPATH, userRoutes)

// connect to RabbitMQ
connectRabbitMQ(() => {
  console.log('Connected to RabbitMQ')
  
  // connect to MongoDB
  mongoose.connect(process.env.AUTH_DATABASE.replace('<password>', process.env.AUTH_DATABASE_PASSWORD))
    .then(() => {
      // listen for requests
      app.listen(process.env.AUTH_PORT, () => {
        console.log('Connected to db & listening on port', process.env.AUTH_PORT)
      })
    })
    .catch((error) => {
      console.log(error)
    })
})