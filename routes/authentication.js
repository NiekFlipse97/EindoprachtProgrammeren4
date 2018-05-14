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
    // TODO: Register the user
});

router.route("/login").post((request, response) => {
    // Get the username and password from the request.
    let email = request.body.email;
    let password = request.body.password;

    console.log(email + " : " + password);

    // Check in database for matching username and password.
    db.query("SELECT * FROM user", (error, rows, fields) => {
        return JSON.stringify(rows.filter(function (user) {
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