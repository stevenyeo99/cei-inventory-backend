const { getConnection } = require('../../utils/db');

const register = async (req, res) => {

    const { username, password } = req.body;

    try {
        const connection = getConnection();
        const [results] = await connection.query('select * from users where username = ?', [username]);

        console.log(results);

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ 
            message: 'Failed to register'
        });
    }
};

module.exports = {
    register
};