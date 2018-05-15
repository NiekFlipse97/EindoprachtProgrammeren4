const express = require("express");
const router = express.Router();
const auth = require('../auth/authentication');
const db = require('../db/mysql-connector');
const ApiErrors = require("../model/ApiErrors.js");

router.all(new RegExp("^(?!\/login$|\/register$).*"), (request, response, next) => {
    console.log("Validate Token");

    // Get the token from the request header.
    const token = request.header('X-Access-Token');

    auth.decodeToken(token, (error, payload) => {
        if (error) {
            // Print the error message to the console.
            console.log('Error handler: ' + error.message);

            // Set the response's status to error.status or 401 (Unauthorised).
            // Return json to the response with an error message.
            response.status((error.status || 401)).json(ApiErrors.notAuthorised)
        } else {
            next();
        }
    });
});

function login(email, password, callback){
    // Check in database for matching username and password.
    db.query(`SELECT * FROM user WHERE Email = "${email}" AND Password = "${password}"`, (error, rows, fields) => {
        if(error) callback(error, null);
        else if(rows.length == 0) callback(ApiErrors.wrongRequestBodyProperties, null);
        else callback(null, {
            token: auth.encodeToken(email),
            email: email
        });
    });
}

router.route("/register").post((request, response) => {
    // Get the users information to store in the database.
    const firstName = request.body.firstname;
    const lastName = request.body.lastname;
    const email = request.body.email;
    const password = request.body.password;

    // Create the query that will be executed.
    const query = {
        sql: 'INSERT INTO user (Voornaam, Achternaam, Email, Password) VALUES(?, ?, ?, ?)',
        values: [firstName, lastName, email, password],
        timeout: 2000
    };

    // Execute the insert query
    db.query(query, (error, rows, fields) => {
        // If there is no error
        if (!error) {
            login(email, password, (error, result) => {
                if(error) response.status(error.code || 500).json(error);
                else response.status(200).json(result);
            });
        } else { 
            // If there is an error.
            // Set the status to 500 (error.code), and return the error message.
            const error = ApiErrors.other(error.message);
            response.status(error.code).json(error);
        }
    });
});

router.route("/login").post((request, response) => {
    // Get the username and password from the request.
    const email = request.body.email;
    const password = request.body.password;

    // Check in database for matching username and password.
    login(email, password, (error, result) => {
        if(error) response.status(error.code || 500).json(error);
        else response.status(200).json(result);
    });
});

module.exports = router;