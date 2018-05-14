const express = require("express")
const router = express.Router()

router.use("/", require("./authentication.js"))
router.use("/studentenhuis", require("./studentenhuis.js"))

module.exports = router