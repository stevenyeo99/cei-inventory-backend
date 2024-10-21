const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

const { getConnection } = require('../../utils/db');

const register = async (req, res) => {

    const { username, password } = req.body;

    try {
        const connection = getConnection();
        const [results] = await connection.query('select * from users where username = ?', [username]);

        if (results.length > 0) {
            return res.status(400).json({ 
                message: 'Username already exists. Try logging in' 
            });
        }

        const hash = await bcrypt.hash(password, saltRounds);

        const result = await connection.query(
            "INSERT INTO users (username, password) VALUES (?, ?)", 
            [username, hash]
        );

        res.status(201).json({ 
            message: 'Successfully registered' 
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ 
            message: 'Failed to register'
        });
    }
};

const login = async (req, res) => {

    const { username, password } = req.body;

    try {
        const connection = getConnection();

        const [result] = await connection.query(
            "SELECT * FROM users WHERE username = ?", 
            [username]
        );

        if (result.length === 0){
            return res.status(401).json({
                error: 'User Name / Password Invalid'
            })
        }   

        const user = result[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return res.status(401).json({
                error:'User Name / Password Invalid'
            })
        }

        const token = jwt.sign({
            username: user.username
        }, 'your_jwt_secret_key', { 
            expiresIn: '1h' 
        });

        res.status(200).json({
            token, 
            username:user.username
        });

    } catch (err) {
        res.status(500).json({
            message: 'System Encounter Error During Login',
            success: false
        });
    }
};

module.exports = {
    register,
    login
};