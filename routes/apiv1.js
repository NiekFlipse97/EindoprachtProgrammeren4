const express = require("express")
const router = express.Router()

app.use("/", require("./authentication.js"))
app.use("/studentenhuis", require("./studentenhuis.js"))

module.exports = router