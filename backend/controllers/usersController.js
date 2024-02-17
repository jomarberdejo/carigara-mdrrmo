
const moment= require('moment')
const bcrypt = require('bcrypt')
const validator = require('validator')
const connection = require('../dbConfig/db');

const getOneUser = async (req, res) => {
    const { id } = req.params;
    // console.log(req.user)
    const sql = `
        SELECT 
        user_id,
        firstname,
        lastname, 
        age,
        contact,
        location,
        email,
        role,
        profileImagePath,
       created_at
        FROM users WHERE user_id = ${Number(id)}
    `;

    connection.query(sql, (error, result) => {
        if (error) {
            res.json(error);
        } else {
            result.forEach((user) => {
                user.created_at = moment(user.created_at).fromNow();
            });
            res.json(result);
        }
    });
};


const getAllUsers = (req, res) => {
    const sql = `SELECT
    user_id,
    firstname,
    lastname,
    age,
    contact,
    location,
    email,
    role,
    profileImagePath,
    created_at
    FROM users  ORDER BY created_at DESC`;

    const result = connection.query(sql, (error, result)=> {
        if (error) {
            res.json(error)
        }
        else{
            result.forEach((user) => {
                user.created_at = moment(user.created_at).format('MMM, DD, YYYY h:mm A');
                
            });
            res.json(result)
        }
    });

    
}

const createUser = async (req, res) => {
    const { firstname, lastname, age, contact, location, email, password, confirmPassword, role } = req.body;

    try {
        if (!firstname || !lastname || !age || !contact || !location || !email || !password || !role) {
            return res.status(400).json({ error: 'All fields must be filled' });
          }
          if (!validator.isInt(age.toString(), {min: 0})) {
            return res.status(400).json({ error: 'Age must be a valid integer' });
          }
          if (!validator.isMobilePhone(contact, 'en-PH')){
            return res.status(400).json({ error: 'Invalid phone number format' });
          }
          if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Email not valid' });
          }
          if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ error: 'Password not strong enough' });
          }
          if(password !== confirmPassword){
            return res.status(400).json({ error: 'Password does not match!' });
          }
      
        const existingUser = await getUserByEmail(email);
        
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }
        
        const ageInput = Number(age)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = `INSERT INTO users (firstname, lastname, age, contact, location, email, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            firstname,
            lastname,
            ageInput,
            contact,
            location,
            email,
            hashedPassword,
            role,
        ];

        connection.query(sql, values, (error, result) => {
            if (error) {
                return res.json(error);
            }
            res.json({ message: `User named ${firstname} ${lastname} created successfully`, result });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM users WHERE email = ?`;
        const values = [email];

        connection.query(sql, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]); 
            }
        });
    });
};


const updateUser = async (req, res) => {
    const { firstname, lastname, age, contact, role, location, profileImagePath} = req.body;
    const { id } = req.params;

    try{
        if (!firstname || !lastname || !age || !contact || !location || !role) {
            return res.status(400).json({ error: 'All required fields must be filled' });
          }
          

          if (!validator.isInt(age.toString(), {min: 0})) {
            return res.status(400).json({ error: 'Age must be a valid integer' });
          }
          if (!validator.isMobilePhone(contact, 'en-PH')){
            return res.status(400).json({ error: 'Invalid phone number format' });
          }
      
        
          
          const validRoles = ['User', 'Admin'];

          if(!validRoles.includes(role)){
            return res.status(400).json({ error: 'Please choose available roles.' });
          }

          const file_path = profileImagePath ? profileImagePath : null;

          

          const sql = `
    UPDATE users 
    SET firstname = ?, lastname = ?, age = ?, contact = ?, role = ?, location = ? ${file_path ? ', profileImagePath = ?' : ''}
    WHERE user_id = ?`;


let values;
if (file_path) {
    values = [firstname, lastname, age, contact, role, location, file_path, Number(id)];
} else {
    values = [firstname, lastname, age, contact, role, location, Number(id)];
}

      

    connection.query(sql, values, (error, result) => {
        if (error) {
            res.json({
                error: error.message
            });
        } else {
            res.json({
                message: `User named: ${firstname} ${lastname} updated succesfully.`,
                result
            });
        }
    });
    }
     catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
}
};

const deleteUser = async(req, res) => {
    const {id} = req.params;
    const sql = `DELETE FROM users WHERE user_id = ?`;

    const values = [Number(id)]
    connection.query(sql,values, (error,  result) => {
        if (error){
            res.json({
                error: error.message
            })
        }
        else{
            res.json({
                message: "User deleted successfully", result
            })
        }
    })
}

module.exports = {
    getAllUsers,
    getOneUser,

    createUser,
    deleteUser,
    updateUser,
    
    
}