/*const express = require('express');
const colors = require('colors');
const morgan = require('morgan'); 
const dotenv = require('dotenv');
const mysql = require('mysql2'); // Import MySQL2

dotenv.config({ path: '../.env' }); // Ensure this is the correct path for .env

// Logging environment variables to ensure they are loaded
// console.log(`Port from .env: ${process.env.PORT}`);
// console.log(`Host: ${process.env.DB_HOST}`);
// console.log(`User: ${process.env.DB_USER}`);
// console.log(`Database: ${process.env.DB_NAME}`);
// console.log(`Password: ${process.env.DB_PASSWORD}`);

// Rest object
const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(morgan('dev'));   // Log incoming requests

// Function to create MySQL connection
const connectDB = () => {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
};

// Route to fetch all students data from the `students` table
app.get('/students', async (req, res) => {
    const connection = connectDB(); // Create a new connection

    try {
        // Query the students table
        const [rows] = await connection.promise().query('SELECT * FROM student');
        
        // Return the result as JSON
        res.status(200).json({
            success: true,
            data: rows,
        });

        // Log the data to the console for verification
        console.log("Students data:", rows);

    } catch (error) {
        console.error("Error fetching students data".bgRed, error);
        res.status(500).json({
            success: false,
            message: "Error fetching students data",
            error: error.message,
        });
    } finally {
        // Close the connection
        connection.end((err) => {
            if (err) {
                console.error('Error while closing the connection'.bgRed, err);
            } else {
                console.log('Database connection closed'.bgBlue);
            }
        });
    }
});

// Port
const port = process.env.PORT || 8080;

// Function to check DB connection and start the server
const startServer = async () => {
    try {
        const connection = connectDB();

        // Attempt to connect to the database
        console.log('Attempting to connect to the database...'.yellow);

        // Promisify connection using .promise() for async/await usage
        const [databases] = await connection.promise().query('SHOW DATABASES;');
        
        console.log("Connected to database successfully".bgGreen);
        console.log("Connected to database successfully".bgGreen);
        console.log("Available Databases:".bgBlue);
        console.log(databases);

        // Start the server if DB connection is successful
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`.bgMagenta.white);
        });
    } catch (error) {
        console.error("Error connecting to the database".bgRed);
        console.error(error);
        process.exit(1); // Exit the process if DB connection fails
    }
};

// Start the server
startServer();*/

const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const pool = require('./db/db.js');  // Import connection pool from db.js

dotenv.config({ path: '../.env' });  // Adjust path if needed

// Initialize Express
const app = express();

// Middleware
app.use(express.json());  // Parse JSON requests
app.use(morgan('dev'));    // Log requests

//Routes
app.use('/api/v1/candidates', require('./routes/studentRoutes.js'));

app.get('/students', async (req, res) => {
    try {
        // Fetch data from the 'student' table using connection pool
        const [rows] = await pool.query('SELECT * FROM student');
        res.status(200).json({
            success: true,
            data: rows,
        });

        console.log("Students data:", rows);
    } catch (error) {
        console.error("Error fetching students data".bgRed, error);
        res.status(500).json({
            success: false,
            message: "Error fetching students data",
            error: error.message,
        });
    }
});

// Server port
const port = process.env.PORT || 8080;

// Function to check DB connection and start the server
// const pool = require('./db/db');  // Assuming your pool is exported from db.js

(async () => {
  try {
    const [rows] = await pool.query('SELECT 1');
    console.log('Connection pool test successful:', rows);
  } catch (error) {
    console.error('Connection pool test failed:', error.message);
  }
})();
const startServer = async () => {
    try {
        // Check the connection by running a simple query
        const [databases] = await pool.query('SHOW DATABASES;');
        console.log("Connected to the database successfully".bgGreen);
        console.log("Available Databases:".bgBlue, databases);

        // Start the server after successful DB connection
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`.bgMagenta.white);
        });
    } catch (error) {
        console.error("Error connecting to the database".bgRed, error);
        process.exit(1);  // Exit the process if DB connection fails
    }
};

// Start the server
startServer();

