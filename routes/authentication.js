// Express
const express = require("express");
const router = express.Router();
// Models
const UserLoginJSON = require("../model/UserLoginJSON");
const UserRegisterJSON = require("../model/UserRegisterJSON");
const ValidToken = require("../model/ValidToken");
// Errors
const ApiError = require("../model/ApiError.js");
const ApiErrors = require("../model/ApiErrors.js");
// Database
const db = require('../db/mysql-connector');
// Authentication
const auth = require('../auth/authentication');

function respondWithError(response, error) {
    if (error) {
        // If the error is not an ApiError, convert it to an ApiError.
        const myError = error instanceof ApiError ? error : ApiErrors.other(error.sqlMessage ? `SQL Error: ${error.sqlMessage} (message: ${error.message})` : error.message);
        // Return the error to the client
        response.status(myError.code).json(myError);
        // Log the error
        console.log(`Oops! An error appeared: ${JSON.stringify(myError)}`)
    }
}

router.all(new RegExp("^(?!\/login$|\/register$).*"), (request, response, next) => {
    console.log("Validate Token");

    // Get the token from the request header.
    const token = request.header('X-Access-Token');

    auth.decodeToken(token, (error, payload) => {
        if (error) respondWithError(response, error);
        else next();
    });
});

function login(email, password, callback){
    // Check in database for matching username and password.
    db.query(`SELECT * FROM user WHERE Email = "${email}" AND Password = "${password}"`, (error, rows, fields) => {
        if(error) console.log(`Error on login query: ${error.message}, ${error.sqlMessage}`);
        if(error) callback(error, null);
        else if(rows.length == 0) callback(ApiErrors.wrongRequestBodyProperties, null);
        else callback(null, new ValidToken(auth.encodeToken(email), email));
    });
}

router.route("/register").post((request, response) => {
    try {
        const registration = UserRegisterJSON.fromJSON(request.body);
        db.query(`SELECT * FROM user WHERE Voornaam = "${registration.firstname}" AND Achternaam = "${registration.lastname}" AND Email = "${registration.email}" AND Password = "${registration.password}"`, (error, rows, fields) => {
            if(error) respondWithError(response, error);
            else if(rows.length > 0) respondWithError(response, ApiErrors.notAuthorised); // User already exists.
            else {
                // Create the query that will be executed.
                const query = {
                    sql: 'INSERT INTO user (Voornaam, Achternaam, Email, Password) VALUES(?, ?, ?, ?)',
                    values: [registration.firstname, registration.lastname, registration.email, registration.password],
                    timeout: 2000
                };
    
                // Execute the insert query
                db.query(query, (error, rows, fields) => {
                    // If there is no error
                    if (!error) {
                        login(registration.email, registration.password, (error, result) => {
                            if(error) respondWithError(response, error);
                            else response.status(200).json(result);
                        });
                    } else { 
                        // If there is an error.
                        respondWithError(response, error);
                    }
                });
            }
        });
    } catch (error) {
        respondWithError(response, error);
    }
});

router.route("/login").post((request, response) => {
    try {
        const loginObject = UserLoginJSON.fromJSON(request.body);

        // Check in database for matching username and password.
        login(loginObject.email, loginObject.password, (error, result) => {
            if(error) respondWithError(response, error);
            else response.status(200).json(result);
        });
    } catch (error) {
        respondWithError(response, error);
    }
});

module.exports = router;