const mysql = require('mysql');
const config = require('../config');

let db = mysql.createConnection(
    {
        host: config.database.host,
        user: config.database.username,
        password: config.database.password,
        database: config.database.name,
        insecureAuth : true
    }
);

db.connect((error) => {
    if (error) {
        console.log(error);
        return;
    } else {
        console.log("Connected to " + config.database.host + ":" + config.database.name);
    }

});

module.exports = db;