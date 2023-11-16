const bcrypt = require('bcrypt')

const connection = require('../dbConfig/db');

const getOneUser = async(req, res) => {
    return res.json({
        message: 'Get single users'
    })
}

const getAllUsers = (req, res) => {
    const sql = `SELECT
    user_id,
    firstname,
    lastname,
    age,
    location,
  
    email,

    role,
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
    FROM users`;

    const result = connection.query(sql, (error, result)=> {
        if (error) {
            res.json(error)
        }
        else{
            res.json(result)
        }
    });

    
}

const loginUser = async(req, res) => {
    const salt = await bcrypt.genSalt(10)
    
    const {firstname, lastname, location, email, password} = req.body;

        
    

    const sql = `SELECT * FROM users WHERE email = ?`
    values = [email]

    connection.query(sql, values, (err, result)=> {
        if (err){
            res.json(err)
        }
        else{
            if (result.length > 0){
                res.json({message: "Email already in use"})
            }
            else{
                const sql = `INSERT INTO users (firstname, lastname, age, location, email, password) VALUES (?, ?, ?, ?, ?, ?)`
                const values = [
                    firstname,
                    lastname,
                    age,
                    location,
                    email,
                    hashedPassword,
                ]
                const result = connection.query(sql, values, (err, result) => {
                    if (err){
                        res.json(err)
                    }
                    else{
                        res.json({ message: 'Register successfully', result });
                    }
                })
            }
        }
    })
}


const updateUser = async(req, res) => {
    return res.json({
        message: 'Update users'
    })
}

const deleteUser = async(req, res) => {
    return res.json({
        message: 'Delete users'
    })
}


module.exports = {
    getAllUsers,
    getOneUser,

    loginUser,
    deleteUser,
    updateUser,
    
    
}