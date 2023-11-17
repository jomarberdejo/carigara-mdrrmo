

const bcrypt = require('bcrypt')

const connection = require('../dbConfig/db');

const getOneUser = async (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT 
        user_id,
        firstname,
        lastname, 
        age,
        location,
        email,
        role,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
        FROM users WHERE user_id = ${Number(id)}
    `;

    connection.query(sql, (error, result) => {
        if (error) {
            res.json(error);
        } else {
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
    location,
  
    email,
    password,
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

const createUser = async (req, res) => {
    const { firstname, lastname, age, location, email, password, role } = req.body;

    try {
        const existingUser = await getUserByEmail(email);
        
        if (existingUser) {
            return res.json({ message: "Email already in use" });
        }
        const ageInput = Number(age)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = `INSERT INTO users (firstname, lastname, age, location, email, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            firstname,
            lastname,
            ageInput,
            location,
            email,
            hashedPassword,
            role,
        ];

        connection.query(sql, values, (err, result) => {
            if (err) {
                return res.json(err);
            }
            res.json({ message: 'Created successfully', result });
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
    const { firstname, lastname, age, role, location } = req.body;
    const { id } = req.params;

    const sql = `
        UPDATE users 
        SET firstname = ?, lastname = ?, age = ?, role = ?, location = ?
        WHERE user_id = ?`;

    const values = [firstname, lastname, age, role, location, Number(id)];

    connection.query(sql, values, (error, result) => {
        if (error) {
            res.json({
                error: error.message
            });
        } else {
            res.json({
                message: "User updated successfully",
                result
            });
        }
    });
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