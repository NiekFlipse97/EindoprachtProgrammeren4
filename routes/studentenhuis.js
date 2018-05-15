const express = require("express");
const router = express.Router();

const ApiError = require("../model/ApiError.js");
const ApiErrors = require("../model/ApiErrors.js");

const auth = require('../auth/authentication');

const db = require('../db/mysql-connector');
const DBManager = require('../db/dbmanager.js');
const dbManager = new DBManager(db);

function respondWithError(response, error) {
    if(error){
        // If the error is not an ApiError, convert it to an ApiError.
        const myError = error instanceof ApiError ? error : ApiErrors.other(error.message);
        // Return the error to the client
        response.status(myError.code).json(myError);
        
        return true; // Indicate that the error was handled
    } else return false;
}

function getUserIDFromRequest(request, callback) {
    // Take the token from the request
    const token = request.header('X-Access-Token');
    // Decode the token
    auth.decodeToken(token, (error, payload) => {
        if(error){ 
            callback(ApiErrors.notAuthorised, null);
            return;
        }
        
        // Get the email from the payload/decoded token
        const userEmail = payload.sub;
        // Search for the user in the database by email
        dbManager.getUserIDFromEmail(userEmail, callback);
    });
}

class CheckObjects {
    // Returns true if the given object is a valid student house
    static isStudentenHuis(object){
        const tmp = 
            object && typeof object == "object" && 
            object.naam && typeof object.naam == "string" && 
            object.adres && typeof object.adres == "string";
        return tmp;
    }

    // Returns true if the given object is a valid meal
    static isMaaltijd(object){
        const tmp = 
            object && typeof object == "object" && 
            object.naam && typeof object.naam == "string" && 
            object.beschrijving && typeof object.beschrijving == "string" &&
            object.ingredienten && typeof object.ingredienten == "string" &&
            object.allergie && typeof object.allergie == "string" &&
            object.prijs && typeof object.prijs == "number";
        
        return tmp;
    }
}

// Studentenhuis

router.route("/").get((request, response) => {
    try {
        dbManager.getStudenthouseResponses((error, studentenHuizen) => {
            if(error) respondWithError(response, error);
            else response.status(200).json(studentenHuizen); // Return a list of all student houses with code 200 (OK)
        });
    } catch (error){
        respondWithError(response, error); // Return the error to the client
    }
});

router.route("/").post((request, response) => {
    try {
        const studentenhuis = request.body;

        if(!CheckObjects.isStudentenHuis(studentenhuis))
            throw ApiErrors.wrongRequestBodyProperties;

        getUserIDFromRequest(request, (error, userID) => {
            if(respondWithError(response, error)) return;

            dbManager.insertStudenthouse(studentenhuis, userID, (error, result) => {
                if(error) respondWithError(response, error);
                else dbManager.getStudenthouseResponseFromNameAndAdress(studentenhuis.naam, studentenhuis.adres, (error, studentenhuis) => {
                    if(error) respondWithError(response, error);
                    else response.status(200).json(studentenhuis);
                })
            })
        });

    } catch (error){
        respondWithError(response, error);
    }
});

router.route("/:huisId?").get((request, response) => {
    try { 
        const huisId = Number(request.params.huisId);
        if(isNaN(huisId)) throw ApiErrors.notFound("huisId");

        dbManager.getStudenthouseResponseFromID(huisID, (error, studentenhuis) => {
            if(error) respondWithError(response, error);
            else response.status(200).json(studentenhuis);
        });
    } catch (error){
        respondWithError(response, error);
    }
});

router.route("/:huisId?").put((request, response) => {
    try {
        const huisId = Number(request.params.huisId);
        if(isNaN(huisId)) throw ApiErrors.notFound("huisId");

        const studentenhuis = request.body;
        if(!CheckObjects.isStudentenHuis(studentenhuis))
            throw ApiErrors.wrongRequestBodyProperties;

        getUserIDFromRequest(request, (error, userID) => {
            if(respondWithError(response, error)) return;

            dbManager.getStudenthouseFromID(huisId, (error, studentenhuis2) => {
                if(error){
                    respondWithError(response, error);
                    return;
                }

                if(studentenhuis2.UserID != userID){
                    respondWithError(response, ApiErrors.conflict("Gebruiker mag deze data niet wijzigen"));
                    return;
                }

                dbManager.updateStudenthouse(studentenhuis, huisId, userID, (error, result) => {
                    if(error) respondWithError(response, error);
                    else dbManager.getStudenthouseResponseFromID(huisId, (error, studentenhuis) => {
                        if(error) respondWithError(response, error);
                        else response.status(200).json(studentenhuis);
                    });
                });
            })
        });
        
    } catch (error){
        respondWithError(response, error);
    }
});

router.route("/:huisId?").delete((request, response) => {
    try {
        const huisId = request.params.huisId;

        /**
         * Verwijder het studentenhuis met de gegeven huisId. 
         * Als er geen studentenhuis met de gevraagde huisId bestaat wordt een juiste foutmelding geretourneerd. 
         * Een gebruiker kan alleen een studentenhuis verwijderen als hij dat zelf heeft aangemaakt. 
         * Deze ID haal je uit het JWT token. 
         * 
         * @return {}
         * @throws ApiErrors.notFound("huisId")
         * @throws ApiErrors.conflict("Gebruiker mag deze data niet verwijderen")
         */

    } catch (error) {
        respondWithError(response, error);
    }
});

// Maaltijd

router.route("/:huisId?/maaltijd").get((request, response) => {
    try { 
        const huisId = request.params.huisId;

        /**
         * @return alle maaltijden voor het studentenhuis met de gegeven huisId. 
         * Als er geen studentenhuis met de gevraagde huisId bestaat wordt een juiste foutmelding geretourneerd. 
         * Iedere gebruiker kan alle maaltijden van alle studentenhuizen opvragen.
         * 
         * @throws ApiKeys.notFound("huisId")
         */

    } catch (error) {
        respondWithError(response, error);
    }
});

router.route("/:huisId?/maaltijd").post((request, response) => {
    try {
        const huisId = request.params.huisId;
        const maaltijd = request.body;
        
        if(!CheckObjects.isMaaltijd(maaltijd))
            throw ApiErrors.wrongRequestBodyProperties;
        
        /**
         * Maak een nieuwe maaltijd voor een studentenhuis. 
         * De ID van de gebruiker die de maaltijd aanmaakt wordt opgeslagen bij de maaltijd. 
         * Deze ID haal je uit het JWT token. 
         * Als er geen studentenhuis met de gevraagde huisId bestaat wordt een juiste foutmelding geretourneerd. 
         * De correctheid van de informatie die wordt gegeven moet door de server gevalideerd worden. 
         * Bij ontbrekende of foutieve invoer wordt een juiste foutmelding geretourneerd.
         * 
         * @throws ApiErrors.notFound("huisId")
         */

    } catch (error) {
        respondWithError(response, error);
    }
});

router.route("/:huisId?/maaltijd/:maaltijdId?").get((request, response) => {
    try { 
        const huisId = request.params.huisId;
        const maaltijdId = request.params.maaltijdId;

        /**
         * @return de maaltijd met het gegeven maaltijdId. 
         * Als er geen studentenhuis of maaltijd met de gevraagde Id bestaat wordt een juiste foutmelding geretourneerd. 
         * Iedere gebruiker kan alle maaltijden van alle studentenhuizen opvragen.
         */

    } catch (error) {
        respondWithError(response, error);
    }
});

router.route("/:huisId?/maaltijd/:maaltijdId?").put((request, response) => {
    try {
        const huisId = request.params.huisId;
        const maaltijdId = request.params.maaltijdId;
        const maaltijd = request.body;
        
        if(!CheckObjects.isMaaltijd(maaltijd))
            throw ApiErrors.wrongRequestBodyProperties;

        /**
         * Vervang de maaltijd met het gegeven maaltijdId door de nieuwe maaltijd in de request body. 
         * Als er geen studentenhuis of maaltijd met de gevraagde Id bestaat wordt een juiste foutmelding geretourneerd. 
         * Alleen de gebruiker die de maaltijd heeft aangemaakt kan deze wijzigen. 
         * De ID van de gebruiker haal je uit het JWT token. 
         * De correctheid van de informatie die wordt gegeven moet door de server gevalideerd worden. 
         * Bij ontbrekende of foutieve invoer wordt een juiste foutmelding geretourneerd.
         * 
         * @throws ApiErrors.notFound("huisId of maaltijdId")
         * @throws ApiErrors.conflict("Gebruiker mag deze data niet wijzigen")
         */

    } catch (error) {
        respondWithError(response, error);
    }
});

router.route("/:huisId?/maaltijd/:maaltijdId?").delete((request, response) => {
    try { 
        const huisId = request.params.huisId;
        const maaltijdId = request.params.maaltijdId;

        /**
         * Verwijder de maaltijd met het gegeven maaltijdId. 
         * Als er geen studentenhuis of maaltijd met de gevraagde Id bestaat wordt een juiste foutmelding geretourneerd. 
         * Alleen de gebruiker die de maaltijd heeft aangemaakt kan deze wijzigen. 
         * De ID van de gebruiker haal je uit het JWT token.
         * 
         * @return {}
         * @throws ApiErrors.notFound("huisId of maaltijdId")
         * @throws ApiErrors.conflict("Gebruiker mag deze data niet verwijderen")
         */

    } catch (error) {
        respondWithError(response, error);
    }
});

// Deelnemers

router.route("/:huisId?/maaltijd/:maaltijdId?/deelnemers").get((request, response) => {
    try { 
        const huisId = request.params.huisId;
        const maaltijdId = request.params.maaltijdId;

        /**
         * @return de lijst met deelnemers voor de maaltijd met gegeven maaltijdID in het studentenhuis met huisId. 
         * Als er geen studentenhuis of maaltijd met de gevraagde Id bestaat wordt een juiste foutmelding geretourneerd. 
         * Deelnemers zijn geregistreerde gebruikers die zich hebben aangemeld voor deze maaltijd. 
         * Iedere gebruiker kan alle deelnemers van alle maaltijden in alle studentenhuizen opvragen.
         * 
         * @throws ApiErrors.notFound("huisId of maaltijdId")
         */

    } catch (error) {
        respondWithError(response, error);
    }
});

router.route("/:huisId?/maaltijd/:maaltijdId?/deelnemers").post((request, response) => {
    try { 
        const huisId = request.params.huisId;
        const maaltijdId = request.params.maaltijdId;

        /**
         * Meld je aan voor een maaltijd in een studentenhuis. 
         * Als er geen studentenhuis of maaltijd met de gevraagde Id bestaat wordt een juiste foutmelding geretourneerd. 
         * De user ID uit het token is dat van de gebruiker die zich aanmeldt. 
         * Die gebruiker wordt dus aan de lijst met aanmelders toegevoegd. 
         * Een gebruiker kan zich alleen aanmelden als hij niet al aan de maaltijd deelneemt; anders volgt een foutmelding
         * 
         * @throws ApiErrors.notFound("huisId of maaltijdId")
         * @throws ApiErrors.conflict("Gebruiker is al aangemeld")
         */

    } catch (error) {
        respondWithError(response, error);
    }
});

router.route("/:huisId?/maaltijd/:maaltijdId?/deelnemers").delete((request, response) => {
    try { 
        const huisId = request.params.huisId;
        const maaltijdId = request.params.maaltijdId;

        /**
         * Verwijder een deelnemer. 
         * Als er geen studentenhuis of maaltijd met de gevraagde Id bestaat wordt een juiste foutmelding geretourneerd. 
         * De deelnemer die wordt verwijderd is de gebruiker met het ID uit het token. 
         * Een gebruiker kan alleen zijn eigen aanmelding verwijderen. 
         * 
         * @return {}
         * @throws ApiErrors.notFound("huisId of maaltijdId")
         */

    } catch (error) {
        respondWithError(response, error);
    }
});

module.exports = router;