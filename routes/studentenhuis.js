const express = require("express");
const router = express.Router();
const ApiError = require("../model/ApiError.js");
const ApiErrors = require("../model/ApiErrors.js");

function respondWithError(response, error){
    // If the error is not an ApiError, convert it to an ApiError.
    let myError = error instanceof ApiError ? error : new ApiError(error.toString(), 500);
    response.status(myError.code).json(myError);
}

class CheckObjects {
    static isStudentenHuis(object){
        return 
            object && typeof object == "object" && 
            object.naam && typeof object.naam == "string" && 
            object.adres && typeof object.adres == "string";
    }

    static isMaaltijd(object){
        return 
            object && typeof object == "object" && 
            object.naam && typeof object.naam == "string" && 
            object.beschrijving && typeof object.beschrijving == "string" &&
            object.ingredienten && typeof object.ingredienten == "string" &&
            object.allergie && typeof object.allergie == "string" &&
            object.prijs && typeof object.prijs == "number";
    }
}

// Studentenhuis

router.route("/").get((request, response) => {
    
});

router.route("/").post((request, response) => {
    try {
        const studentenhuis = request.body;

        if(!CheckObjects.isStudentenHuis(studentenhuis))
            throw ApiErrors.wrongRequestBodyProperties;

    } catch (error){
        respondWithError(response, error);
    }
});

router.route("/:huisId?").get((request, response) => {
    const huisId = request.params.huisId;
});

router.route("/:huisId?").put((request, response) => {
    try {
        const huisId = request.params.huisId;
        const studentenhuis = request.body;

        if(!CheckObjects.isStudentenHuis(studentenhuis))
            throw ApiErrors.wrongRequestBodyProperties;

    } catch (error){
        respondWithError(response, error);
    }
});

router.route("/:huisId?").delete((request, response) => {
    const huisId = request.params.huisId;
});

// Maaltijd

router.route("/:huisId?/maaltijd").get((request, response) => {
    const huisId = request.params.huisId;
});

router.route("/:huisId?/maaltijd").post((request, response) => {
    try {
        const huisId = request.params.huisId;
        const maaltijd = request.body;
        
        if(!CheckObjects.isMaaltijd(maaltijd))
            throw ApiErrors.wrongRequestBodyProperties;

    } catch (error){
        respondWithError(response, error);
    }
});

router.route("/:huisId?/maaltijd/:maaltijdId?").get((request, response) => {
    const huisId = request.params.huisId;
    const maaltijdId = request.params.maaltijdId;
});

router.route("/:huisId?/maaltijd/:maaltijdId?").put((request, response) => {
    try {
        const huisId = request.params.huisId;
        const maaltijdId = request.params.maaltijdId;
        const maaltijd = request.body;
        
        if(!CheckObjects.isMaaltijd(maaltijd))
            throw ApiErrors.wrongRequestBodyProperties;

    } catch (error){
        respondWithError(response, error);
    }
});

router.route("/:huisId?/maaltijd/:maaltijdId?").delete((request, response) => {
    const huisId = request.params.huisId;
    const maaltijdId = request.params.maaltijdId;
});

// Deelnemers

router.route("/:huisId?/maaltijd/:maaltijdId?/deelnemers").get((request, response) => {
    const huisId = request.params.huisId;
    const maaltijdId = request.params.maaltijdId;
});

router.route("/:huisId?/maaltijd/:maaltijdId?/deelnemers").post((request, response) => {
    const huisId = request.params.huisId;
    const maaltijdId = request.params.maaltijdId;
});

router.route("/:huisId?/maaltijd/:maaltijdId?/deelnemers").delete((request, response) => {
    const huisId = request.params.huisId;
    const maaltijdId = request.params.maaltijdId;
});

module.exports = router;