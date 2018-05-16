const mysql = require('mysql');
const config = require('../config');

// When the variabeles in process.env are set (config vars in Heroku), use them instead of config.json
const dbConfig = process.env.DB_DATABASE && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_HOST ? {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_DATABASE
} : config.database;

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