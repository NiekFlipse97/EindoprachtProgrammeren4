const express = require("express");
const router = express.Router({});
const auth = require('../auth/authentication');
const db = require('../db/mysql-connector');

router.all(new RegExp("^(?!\/login$|\/register$).*"), (request, response, next) => {
    console.log("Validate Token");

    // Get the token from the request header.
    let token = request.header('X-Access-Token');

    auth.decodeToken(token, (error, payload) => {
        if (error) {
            // Print the error message to the console.
            console.log('Error handler: ' + error.message);

            // Set the response's status to error.status or 401(Unauthorised).
            // Return json to the response with an error message.
            response.status((error.status || 401)).json({
                error: new Error("Not authorised").message
            })
        } else {
            next();
        }
    });
});

router.route("/register").post((request, response) => {
    // Get the users information to store in the database.
    let firstName = request.body.firstname;
    let lastName = request.body.lastname;
    let email = request.body.email;
    let password = request.body.password;

    // Create the query that will be executed.
    const query = {
        sql: 'INSERT INTO user (Voornaam, Achternaam, Email, Password) VALUES(?, ?, ?, ?)',
        values: [firstName, lastName, email, password],
        timeout: 2000
    };

    // Execute the insert query
    db.query(query, (error, rows, fields) => {
        // If there is no error
        if (! error) {
            // Set the status to 200, and return the message 'OK!'
            response.status(200)
                .json({
                    msg: 'OK!'
                })
        } else { // If there is an error.
            // Set the status to 500, and return the error message.
            response.status(500)
                .json({
                    error: error.toString()
                })
        }
    })
});

router.route("/login").post((request, response) => {
    // Get the username and password from the request.
    let email = request.body.email;
    let password = request.body.password;

    // Check in database for matching username and password.
    db.query("SELECT * FROM user", (error, rows, fields) => {
        JSON.stringify(rows.filter(function (user) {
            if (user.Email === email && user.Password === password) {
                response.status(200)
                    .json({
                        token: auth.encodeToken(email),
                        username: email
                    });
            }
        }));
    });

});

module.exports = router;