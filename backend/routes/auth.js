const express = require('express')

// controller functions
const { signUpUser, signInUser } = require('../controllers/authController')

const router = express.Router()

// login route
router.post('/signin', signInUser)

// signup route
router.post('/signup', signUpUser)

module.exports = router