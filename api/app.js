const express = require('express');
const path = require('path');
const cors = require('cors');
const winston = require('winston');
const pool = require('./db');
const { getData } = require('./getdata');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3200;

// Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'server.log' })
    ],
});

// CORS configuration
app.use(cors({
    origin: '*', // Allow requests from any origin
}));

// Middleware for parsing JSON requests
app.use(express.json());

// Endpoint to fetch table names
app.get('/api/tables', async (req, res) => {
    try {
        const [results] = await pool.query('SHOW TABLES');
        const tableNames = results.map(row => Object.values(row)[0]);
        res.json(tableNames);
    } catch (err) {
        logger.error(`Error retrieving table list: ${err.message}`);
        res.status(500).send(`Error retrieving table list: ${err.message}`);
    }
});

// Dynamically create endpoints for each table
app.get('/api/:tableName', async (req, res) => {
    const tableName = req.params.tableName;
    try {
        const results = await getData(tableName);
        res.json(results);
    } catch (err) {
        logger.error(`Error retrieving data from ${tableName}: ${err.message}`);
        res.status(500).send(`Error retrieving data from ${tableName}: ${err.message}`);
    }
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.send('Test endpoint is working');
});

// Start the server
app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});
