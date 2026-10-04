const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0
});

(async () => {
    try {
        const conn = await pool.getConnection();
        console.log(
            "Connected successfully to MYSQL Database:",
            process.env.DB_NAME
        );
        conn.release();
    } catch (error) {
        console.error(
            "Warning: MySQL Connection Failed. Make Sure MySQL Server is running and credentials match in .env file."
        );
        console.error("Error Details:", error.message);
    }
})();

module.exports = pool;