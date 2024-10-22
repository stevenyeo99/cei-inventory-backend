const { getConnection } = require('../../utils/db');

const getItems = async (req, res) => {

    try {
        
        const connection = getConnection();
        const query = "SELECT * FROM items ";
        const [results] = await connection.query(query);

        res.status(200).json(results);
    } catch (err){
        res.status(500).json({
            message: 'System Error Failed to retrieve data'
        })
    }
};

const createItems = async (req, res) => {
    const { partNumber, partName, uom, qty } = req.body;

    try{
        const connection = getConnection();
        // insert item record
        await connection.query(
            'INSERT INTO items (part_number, part_name, uom, qty) VALUES (?, ?, ?, ?)',
            [partNumber, partName, uom, qty]
        );

        res.status(201).json({
            message:'Data successfully saved'
        });
    }catch(err){
        console.log(err.message)
        res.status(500).json({
            message:'System Error Failed to save data'
        })
    }
};

module.exports = {
    getItems,
    createItems,
}