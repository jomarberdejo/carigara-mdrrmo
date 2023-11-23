const jwt = require('jsonwebtoken');
const connection = require('../dbConfig/db');

const requireAuth = async (req, res, next) => {
   
    const { authorization } = req.headers;
    if (!authorization) {
        
        res.status(401).json({ error: "Authorization token required" });
        return;
    }
    

    const token = authorization.split(' ')[1];
    

    try {
        
        const { user_id } = jwt.verify(token, process.env.SECRET);
     
        const user = await getUserByUserID(user_id);

        if (!user) {
            res.status(401).json({ error: "User not found" });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Request is not authorized" });
    }
};

const getUserByUserID = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT user_id FROM users WHERE user_id = ?`;
        const values = [Number(id)];

        connection.query(sql, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                
                resolve(result[0]);
               
            }
        });
    });
};

module.exports = requireAuth;
