const express = require("express");
const router = express.Router();

const ApiError = require("../model/ApiError.js");
const ApiErrors = require("../model/ApiErrors.js");
const db = require('../db/mysql-connector');
const auth = require('../auth/authentication');

const DBManager = require('../db/dbmanager.js');
const dbManager = new DBManager(db);

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

function getUserIDFromRequest(request, callback) {
    // Take the token from the request
    const token = request.header('X-Access-Token');
    // Decode the token
    auth.decodeToken(token, (error, payload) => {
        if (error) {
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
    static isStudentenHuis(object) {
        const tmp =
            object && typeof object == "object" &&
            object.naam && typeof object.naam == "string" &&
            object.adres && typeof object.adres == "string";
        return tmp;
    }

    // Returns true if the given object is a valid meal
    static isMaaltijd(object) {
        const tmp =
            object && typeof object == "object" &&
            object.naam && typeof object.naam == "string" &&
            object.beschrijving && typeof object.beschrijving == "string" &&
            object.ingredienten && typeof object.ingredienten == "string" &&
            object.allergie && typeof object.allergie == "string" &&
            object.prijs && typeof object.prijs == "number";

        return tmp;
    }

    // Returns true if the given ovject is a valid deelnemer
    static isDeelnemer(object) {
        const tmp =
            object && typeof object === "object" &&
            object.voornaam && typeof object.voornaam === "string" &&
            object.achternaam && typeof object.achternaam === "string" &&
            object.email && typeof object.email === "string";

        return tmp;
    }
}

// Studentenhuis

router.route("/").get((request, response) => {
    try {
        dbManager.getStudenthouseResponses((error, studentenHuizen) => {
            if (error) respondWithError(response, error);
            else response.status(200).json(studentenHuizen); // Return a list of all student houses with code 200 (OK)
        });
    } catch (error) {
        respondWithError(response, error); // Return the error to the client
    }
});

router.route("/").post((request, response) => {
    try {
        const studentenhuis = request.body;

        if (!CheckObjects.isStudentenHuis(studentenhuis))
            throw ApiErrors.wrongRequestBodyProperties;

        getUserIDFromRequest(request, (error, userID) => {
            if (error) respondWithError(response, error);
            else dbManager.insertStudenthouse(studentenhuis, userID, (error, result) => {
                if (error) respondWithError(response, error);
                else dbManager.getStudenthouseResponseFromNameAndAdress(studentenhuis.naam, studentenhuis.adres, (error, studentenhuis) => {
                    if (error) respondWithError(response, error);
                    else response.status(200).json(studentenhuis);
                })
            })
        });
    } catch (error) {
        respondWithError(response, error);
    }
});

router.route("/:huisId?").get((request, response) => {
    try {
        const huisId = Number(request.params.huisId);
        if (isNaN(huisId)) throw ApiErrors.notFound("huisId");

        dbManager.getStudenthouseResponseFromID(huisId, (error, studentenhuis) => {
            if (error) respondWithError(response, error);
            else response.status(200).json(studentenhuis);
        });
    } catch (error) {
        respondWithError(response, error);
    }
});

router.route("/:huisId?").put((request, response) => {
    try {
        const huisId = Number(request.params.huisId);
        if (isNaN(huisId)) throw ApiErrors.notFound("huisId");

        const studentenhuis = request.body;
        if (!CheckObjects.isStudentenHuis(studentenhuis))
            throw ApiErrors.wrongRequestBodyProperties;

        getUserIDFromRequest(request, (error, userID) => {
            if (error) respondWithError(response, error);
            else dbManager.getStudenthouseFromID(huisId, (error, studentenhuis2) => {
                if (error) {
                    respondWithError(response, error);
                } else if (studentenhuis2.UserID != userID) { // Check if user is creator of this house
                    respondWithError(response, ApiErrors.conflict("Gebruiker mag deze data niet wijzigen"));
                } else { // Update house
                    dbManager.updateStudenthouse(studentenhuis, huisId, userID, (error, result) => {
                        if (error) respondWithError(response, error);
                        else dbManager.getStudenthouseResponseFromID(huisId, (error, studentenhuis) => {
                            if (error) respondWithError(response, error);
                            else response.status(200).json(studentenhuis); // return the house as result
                        });
                    });
                }
            });
        });
    } catch (error) {
        respondWithError(response, error);
    }
});

router.route("/:huisId?").delete((request, response) => {
    try {
        const huisId = Number(request.params.huisId);
        if (isNaN(huisId)) throw ApiErrors.notFound("huisId");

        getUserIDFromRequest(request, (error, userID) => {
            if (error) respondWithError(response, error);
            else dbManager.getStudenthouseFromID(huisId, (error, studentenhuis) => {
                if (error) {
                    respondWithError(response, error);
                } else if (studentenhuis.UserID != userID) { // Check if user is creator of this house
                    respondWithError(response, ApiErrors.conflict("Gebruiker mag deze data niet verwijderen"));
                } else { // Delete house
                    dbManager.deleteStudenthouse(huisId, userID, (error, result) => {
                        if (error) respondWithError(response, error);
                        else response.status(200).json({});
                    });
                }
            });
        });
    } catch (error) {
        respondWithError(response, error);
    }
});

// Maaltijd

router.route("/:huisId/maaltijd").get((request, response) => {
    try {
        const huisId = request.params.huisId;

        /**
         * @return alle maaltijden voor het studentenhuis met de gegeven huisId.
         * Als er geen studentenhuis met de gevraagde huisId bestaat wordt een juiste foutmelding geretourneerd.
         * Iedere gebruiker kan alle maaltijden van alle studentenhuizen opvragen.
         *
         * @throws ApiKeys.notFound("huisId")
         */

        db.query("SELECT * FROM maaltijd WHERE StudentenhuisID = ? ", [huisId], (error, rows, fields) => {
            if (error) {
                response.status(error.code).json(JSON.stringify(error.message));
                return;
            }

            if (rows.length < 1) {
                const error = ApiErrors.notFound("huisId");
                response.status(error.code).json(error);
                return;
            }

            for (let i = 0; i < rows.length; i++) {
                response.json({
                    name: rows[i].Naam,
                    description: rows[i].Beschrijving,
                    ingredients: rows[i].Ingredienten,
                    price: rows[i].Prijs
                })
            }

        })
    } catch (error) {
        respondWithError(response, error);
    }
});

router.route("/:huisId?/maaltijd").post((request, response) => {
    try {
        const huisId = request.params.huisId;
        const maaltijd = request.body;
        const token = request.header('X-Access-Token');

        if (!CheckObjects.isMaaltijd(maaltijd)) {
            const error = ApiErrors.wrongRequestBodyProperties;
            response.status(error.code).json(error);
            return;
        }

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
        auth.decodeToken(token, (error, payload) => {
            let email = payload.sub;

            db.query("SELECT ID FROM user WHERE Email = ?", [email], (error, rows, fields) => {
                let userId = rows[0].ID;

                checkHouseId(huisId, response);

                db.query("INSERT INTO maaltijd (Naam, Beschrijving, Ingredienten, Allergie, Prijs, UserID, StudentenhuisID) VALUES (?, ?, ?, ?, ?, ?, ?)", [maaltijd.naam, maaltijd.beschrijving, maaltijd.ingredienten, maaltijd.allergie, maaltijd.prijs, userId, huisId], (err, rows, fields) => {
                    if (err) {
                        response.status(err.status).json(JSON.stringify(err.message));
                        return;
                    }
                    db.query("SELECT Naam, Beschrijving, Ingredienten, Allergie, Prijs FROM `maaltijd` WHERE Naam = ? AND StudentenhuisID = ?", [maaltijd.naam, huisId], function (err, result,) {
                        if (err) {
                            response.status(err.status).json(JSON.stringify(err.message));
                            return;
                        }
                        response.json(result)
                    })
                });
            })
        });
    } catch (error) {
        respondWithError(response, error);
    }
});

router.route("/:huisId?/maaltijd/:maaltijdId").get((request, response) => {
    try {
        const huisId = request.params.huisId;
        const maaltijdId = request.params.maaltijdId;

        /**
         * @return de maaltijd met het gegeven maaltijdId.
         * Als er geen studentenhuis of maaltijd met de gevraagde Id bestaat wordt een juiste foutmelding geretourneerd.
         * Iedere gebruiker kan alle maaltijden van alle studentenhuizen opvragen.
         */

        checkHouseId(huisId, response);

        db.query("SELECT * FROM maaltijd WHERE ID = ?", [maaltijdId], (error, rows, fields) => {
            if (rows.length < 1) {
                const error = ApiErrors.notFound("maaltijdId");
                response.status(error.code).json(error);
                return;
            }

            for (let i = 0; i < rows.length; i++) {
                response.json({
                    name: rows[i].Naam,
                    description: rows[i].Beschrijving,
                    ingredients: rows[i].Ingredienten,
                    price: rows[i].Prijs
                })
            }

        })

    } catch (error) {
        respondWithError(response, error);
    }
});

router.route("/:huisId/maaltijd/:maaltijdId").put((request, response) => {
    try {
        const huisId = request.params.huisId;
        const maaltijdId = request.params.maaltijdId;
        const maaltijd = request.body;

        if (!CheckObjects.isMaaltijd(maaltijd))
            throw ApiErrors.wrongRequestBodyProperties;

        checkHouseId(huisId, response);

        getUserIDFromRequest(request, (error, id) => {
            if (error) {
                respondWithError(response, error);
            } else {
                dbManager.getMealFromID(maaltijdId, (error, maaltijd2) => {
                    if (error) {
                        respondWithError(response, error);
                    } else if (maaltijd2.UserID != id) {
                        respondWithError(response, ApiErrors.conflict("Gebruiker mag deze maaltijd niet wijzigen"))
                    } else { // Update the meal
                        dbManager.updateMeal(maaltijd, maaltijdId, id, (error, result) => {
                            if (error) respondWithError(response, error);
                            else dbManager.getMealResponseFromID(maaltijdId, (error, maaltijd) => {
                                if (error) respondWithError(response, error);
                                else response.status(200).json(maaltijd);
                            })

                        })
                    }
                })
            }
        });
    } catch (error) {
        respondWithError(response, error);
    }
});

router.route("/:huisId?/maaltijd/:maaltijdId?").delete((request, response) => {
    try {
        const huisId = request.params.huisId;
        const maaltijdId = request.params.maaltijdId;
        const token = request.header('X-Access-Token');

        /**
         * Verwijder de maaltijd met het gegeven maaltijdId.
         * Als er geen studentenhuis of maaltijd met de gevraagde Id bestaat wordt een juiste foutmelding geretourneerd.
         * Alleen de gebruiker die de maaltijd heeft aangemaakt kan deze verwijderen.
         * De ID van de gebruiker haal je uit het JWT token.
         *
         * @return {}
         * @throws ApiErrors.notFound("huisId of maaltijdId")
         * @throws ApiErrors.conflict("Gebruiker mag deze data niet verwijderen")
         */

        auth.decodeToken(token, (error, payload) => {
            db.query("SELECT ID FROM user WHERE Email = ?", [payload.sub], (error, rows, fields) => {
                checkHouseId(huisId, response);

                db.query("SELECT * FROM maaltijd WHERE ID = ?", [maaltijdId], (error, r, f) => {
                    if (error) {
                        response.status(error.code).json(JSON.stringify(error.message));
                    }
                    if (r.length < 1) {
                        const error = ApiErrors.notFound("maaltijdId");
                        response.status(error.code).json(error);
                        return;
                    }

                    if (r[0].UserID === rows[0].ID) {
                        db.query("DELETE FROM maaltijd WHERE ID = ?", [maaltijdId], (error, result) => {
                            response.json({
                                msg: "Maaltijd succesvol verwijderd"
                            })
                        })
                    } else {
                        const error = ApiErrors.conflict("User is not allowed to delete this meal");
                        response.status(error.code).json(error);
                    }
                })
            })
        });
    } catch (error) {
        respondWithError(response, error);
    }
});

// Deelnemers

router.route("/:huisId/maaltijd/:maaltijdId/deelnemers").get((request, response) => {
    try {
        const huisId = request.params.huisId;
        const maaltijdId = request.params.maaltijdId;

        checkHouseId(huisId, response);

        dbManager.getUsersFromMaaltijdID(maaltijdId, (error, users) => {
            if (error) respondWithError(response, error);
            response.json(users);
        })

    } catch (error) {
        respondWithError(response, error);
    }
});

router.route("/:huisId?/maaltijd/:maaltijdId?/deelnemers").post((request, response) => {
    try {
        const huisId = request.params.huisId;
        const maaltijdId = request.params.maaltijdId;

        checkHouseId(huisId, response);

        getUserIDFromRequest(request, (error, userId) => {
            if (error) {
                respondWithError(response, error);
            } else {
                dbManager.insertDeelnemer(userId, maaltijdId, huisId, (error, result) => {
                    if (error) {
                        respondWithError(response, error);
                    } else {
                        dbManager.getUsersFromMaaltijdID(maaltijdId, (error, users) => {
                            if (error) {
                                respondWithError(response, error);
                            }

                            response.json(users);
                        })
                    }
                });
            }
        })

    } catch (error) {
        respondWithError(response, error);
    }
});

router.route("/:huisId?/maaltijd/:maaltijdId?/deelnemers").delete((request, response) => {
    try {
        const huisId = request.params.huisId;
        const maaltijdId = request.params.maaltijdId;

        checkHouseId(huisId, response);

        getUserIDFromRequest(request, (error, userId) => {
            if (error) respondWithError(response, error);

            dbManager.deleteUserFromDeelnemers(userId, maaltijdId, (error, rows, fields) => {
                if (error) respondWithError(response, error);

                dbManager.getUsersFromMaaltijdID(maaltijdId, (error, users) => {
                    if (error) respondWithError(response, error);

                    response.json(users);
                })
            })
        })

    } catch (error) {
        respondWithError(response, error);
    }
});

function checkHouseId(houseId, res) {
    db.query("SELECT * FROM studentenhuis WHERE ID = ?", [houseId], (err, result) => {
        if (result.length < 1) {
            const error = ApiErrors.notFound("studentenhuisId");
            res.status(error.code).json(error);
        }
    })
}

module.exports = router;