const mysql=require('mysql2/promise');
require("dotenv").config();
const pool=mysql.createPool( {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'localhost',
    host: process.env.DB_HOST,
    dialect: 'MYSQL',
    port: process.env.DB_PORT,
    pool: {
      max: 50,
      min: 0,
      acquire: 30000,
      idle: 10000,
      maxIdleTime: 70000
    },
  });
  async function getConnection() {
    try{
      const con=await pool.getConnection();
      console.log('Connected successfully to MYSQL Database:',process.env.DB_NAME);
      con.release();

    }catch(error){
      console.warn("Warning: MySQL Connection Failed. Make Sure MySQL Server is running and credentials match in .env file.")
      console.warn("Error Details:", error.message)
    }
  }
  getConnection();
  module.exports=pool