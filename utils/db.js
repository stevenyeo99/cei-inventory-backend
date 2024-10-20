const mysql = require('mysql2/promise');

let connection;

async function initializeDatabase() {
  if (!connection) {
    const dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    };

    console.log(dbConfig);

    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to the MySQL database.');
  }
  return connection;
}

// Export the connection initializer
module.exports = {
  initializeDatabase,
  getConnection: () => connection,
};