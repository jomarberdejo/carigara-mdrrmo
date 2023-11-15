const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcrypt');
const connection = require('../dbConfig/db');

const createToken = (user_id) => {
  return jwt.sign({ user_id }, process.env.SECRET, { expiresIn: '3d' });
};

// login a user
const signInUser = async (req, res) => {
  const { email, password } = req.body;

  try {
  
    const userQuery = 'SELECT * FROM users WHERE email = ?';
    connection.query(userQuery, [email], async (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.length > 0) {
        const user = results[0];
        const storedHashedPassword = user.password;

        const isPasswordMatch = await bcrypt.compare(password, storedHashedPassword);

        if (isPasswordMatch) {
         
          const token = createToken(user.user_id);
          return res.status(200).json({ email, token });
        } else {
          
          return res.status(401).json({ error: 'Invalid credentials' });
        }
      } else {
      
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// signup a user
const signUpUser = async (req, res) => {
  const { firstname, lastname, age, location, email, password } = req.body;

  try {
    // validation
    if (!firstname || !lastname || !age || !location || !email || !password) {
      return res.status(400).json({ error: 'All fields must be filled' });
    }
    if (!validator.isInt(age.toString(), {min: 0})) {
      return res.status(400).json({ error: 'Age must be a valid integer' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Email not valid' });
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ error: 'Password not strong enough' });
    }

    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    connection.query(checkQuery, [email], async (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error checking existing user' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'User with this email already exists' });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const insertQuery = 'INSERT INTO users (firstname, lastname, age, location, email, password) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(insertQuery, [firstname, lastname, age, location, email, hashedPassword], (error, results) => {
          if (error) {
            return res.status(500).json({ error: 'Error creating user' });
          }

          const userId = results.insertId;
          const token = createToken(userId);
          return res.status(200).json({ email, token });
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { signUpUser, signInUser };