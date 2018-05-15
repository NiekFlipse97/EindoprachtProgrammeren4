const mysql = require('mysql');
const config = require('../config');

const dbConfig = {
    host: process.env.DB_DATABASE || config.database.host,
    user: process.env.DB_USER || config.database.username,
    password: process.env.DB_PASSWORD || config.database.password,
    database: process.env.DB_NAME || config.database.name
};

const db = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.name,
    insecureAuth : true
});

db.connect((error) => {
    console.log(error ? error : `Connected to ${dbConfig.host}:${dbConfig.name}`);
});

module.exports = db;