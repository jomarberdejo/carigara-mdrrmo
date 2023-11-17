
const express = require('express')
const router = express.Router();

const { createUser, updateUser, deleteUser, getOneUser, getAllUsers } = require('../controllers/usersController');


//GET ALL users
router.get('/' , getAllUsers)

//GET SINGLE users
router.get('/:id' , getOneUser)

//ADD NEW users
router.post('/' , createUser)

//DELETE users
router.delete('/:id' , deleteUser)


//UPDATE users
router.patch('/:id' , updateUser)





module.exports = router
