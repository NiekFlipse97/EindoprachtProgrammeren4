const express = require("express");
const router = express.Router();
const ApiError = require("../model/ApiError.js");

// Studentenhuis

function isStudentenHuis(object){
    return 
        object && typeof object == "object" && 
        object.naam && typeof object.naam == "string" && 
        object.adres && typeof object.adres == "string";
}

router.route("/").get((request, response) => {
    
});

router.route("/").post((request, response) => {
    try {
        const studentenhuis = request.body;

        if(!isStudentenHuis(studentenhuis))
            throw new ApiError("Een of meer properties in de request body ontbreken of zijn foutief", 412);

    } catch (error){
        response.status(error.code || 500).json(error);
    }
});

router.route("/:huisId?").get((request, response) => {

});

router.route("/:huisId?").put((request, response) => {
    try {
        const studentenhuis = request.body;

        if(!isStudentenHuis(studentenhuis))
            throw new ApiError("Een of meer properties in de request body ontbreken of zijn foutief", 412);

    } catch (error){
        response.status(error.code || 500).json(error);
    }
});

router.route("/:huisId?").delete((request, response) => {

});

// Maaltijd

function isMaaltijd(object){
    return 
        object && typeof object == "object" && 
        object.naam && typeof object.naam == "string" && 
        object.beschrijving && typeof object.beschrijving == "string" &&
        object.ingredienten && typeof object.ingredienten == "string" &&
        object.allergie && typeof object.allergie == "string" &&
        object.prijs && typeof object.prijs == "number";
}

router.route("/:huisId?/maaltijd").get((request, response) => {

});

router.route("/:huisId?/maaltijd").post((request, response) => {
    try {
        const maaltijd = request.body;
        
        if(!isMaaltijd(maaltijd))
            throw new ApiError("Een of meer properties in de request body ontbreken of zijn foutief", 412);

    } catch (error){
        response.status(error.code || 500).json(error);
    }
});

router.route("/:huisId?/maaltijd/:maaltijdId?").get((request, response) => {

});

router.route("/:huisId?/maaltijd/:maaltijdId?").put((request, response) => {
    try {
        const maaltijd = request.body;
        
        if(!isMaaltijd(maaltijd))
            throw new ApiError("Een of meer properties in de request body ontbreken of zijn foutief", 412);

    } catch (error){
        response.status(error.code || 500).json(error);
    }
});

router.route("/:huisId?/maaltijd/:maaltijdId?").delete((request, response) => {

});

// Deelnemers

router.route("/:huisId?/maaltijd/:maaltijdId?/deelnemers").get((request, response) => {

});

router.route("/:huisId?/maaltijd/:maaltijdId?/deelnemers").post((request, response) => {

});

router.route("/:huisId?/maaltijd/:maaltijdId?/deelnemers").delete((request, response) => {

});

module.exports = router;