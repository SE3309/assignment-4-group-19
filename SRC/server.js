require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const connection = require('./config/db'); // MySQL connection
const courseRoutes = require('./routes/courseRoutes'); // Import course routes

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000

// Middleware
app.use(express.json()); // Parse JSON bodies

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        process.exit(1);
    }

    const query = `
        SELECT TABLE_NAME 
        FROM information_schema.tables 
        WHERE table_schema = '${process.env.DB_NAME}'
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching tables:', err.message);
            process.exit(1);
        }

        console.log('Available Tables:');
        results.forEach((row) => {
            console.log(row.TABLE_NAME); // Corrected key for table name
        });

        console.log('---------------------------'); // Dashed line
    });
});

// Routes
app.use('/courses', courseRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
