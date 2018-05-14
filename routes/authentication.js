const express = require("express")
const router = express.Router()

router.all(new RegExp("^(?!\/login$|\/register$).*"), (request, response, next) => {
    // TODO: Check if token is valid
    next()
})

router.route("/register").post((request, response) => {
    // TODO: Register the user
})

router.route("/login").post((request, response) => {
    // TODO: Check if the users exists and return the token
})

module.exports = router