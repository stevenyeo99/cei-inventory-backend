const { getConnection } = require('../../utils/db');

const createDivision = async (req, res) => {

    const { divisionName, divisionCode } = req.body;

    try{
        const connection = getConnection();
        await connection.query(
            'INSERT INTO divisions (division_name, division_code) VALUES (?, ?)',
            [divisionName, divisionCode]
        );

        res.status(201).json({
            message:'Division Data Created Successfully'
        });
    }catch (err){
        res.status(500).json({message: 'System Error to Create Division Data'})
        console.log(err.message)
    }
};

const getDivisions = async (req, res) => {
    try{
        const connection = getConnection();
        const query = "SELECT * FROM divisions ";
        const [results] = await connection.query(query);
        res.status(200).json(results);
    }catch (err){
        res.status(500).json({
            message:'System Error Failed to fetch data'
        });
    }
};

module.exports = {
    createDivision,
    getDivisions
};