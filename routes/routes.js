const express = require('express')

// controller functions
const { loginUser, signupUser } = require('../controllers/userController')
const { loginSpecialist, signupSpecialist, getSpecialities  } = require('../controllers/specialistController')

const router = express.Router()

// login route
router.post('/user-login', loginUser)

// signup route
router.post('/user-signup', signupUser)

// login specialist
router.post('/specialist-login', loginSpecialist)

// signup specialist
router.post('/specialist-signup', signupSpecialist)

router.get('/specialities', getSpecialities )


module.exports = router