const express = require("express");
const router = express.Router();

// Studentenhuis

router.route("/").get((request, response) => {});

router.route("/").post((request, response) => {});

router.route("/:huisId?").get((request, response) => {});

router.route("/:huisId?").put((request, response) => {});

router.route("/:huisId?").delete((request, response) => {});

// Maaltijd

router.route("/:huisId?/maaltijd").get((request, response) => {});

router.route("/:huisId?/maaltijd").post((request, response) => {});

router.route("/:huisId?/maaltijd/:maaltijdId?").get((request, response) => {});

router.route("/:huisId?/maaltijd/:maaltijdId?").put((request, response) => {});

router.route("/:huisId?/maaltijd/:maaltijdId?").delete((request, response) => {});

// Deelnemers

router.route("/:huisId?/maaltijd/:maaltijdId?/deelnemers").get((request, response) => {});

router.route("/:huisId?/maaltijd/:maaltijdId?/deelnemers").post((request, response) => {});

router.route("/:huisId?/maaltijd/:maaltijdId?/deelnemers").delete((request, response) => {});

module.exports = router;