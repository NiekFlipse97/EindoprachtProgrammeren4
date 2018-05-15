const ApiErrors = require("../model/ApiErrors.js");
const StudentenhuisResponse = require("../model/StudentenhuisResponse.js");

module.exports = class DBManager {
    constructor(db){
        this._db = db;
    }

    getUserIDFromEmail(email, callback){
        _db.query(`SELECT * FROM user WHERE EMAIL = "${userEmail}"`, (error, rows, fields) => {
            if(error) callback(error, null);
            else callback(null, rows[0].ID);
        });
    }

    getStudenthouseResponses(callback){
        _db.query(`SELECT * FROM view_studentenhuis`, (error, rows, fields) => {
            try {
                if(error) throw error;

                // Replace all items in the list with the correct object
                const studentenHuizen = rows.map((item) => StudentenhuisResponse.fromDatabaseObject(item));
                callback(null, studentenHuizen); // Return a list of all student houses
            } catch (error) {
                callback(error, null)
            }
        });
    }
    
    getStudenthouseResponseFromNameAndAdress(name, adress, callback){
        _db.query(`SELECT * FROM view_studentenhuis WHERE Naam = "${name}" AND Adres = "${adress}"`, (error, rows, fields) => {
            try {
                if(error) throw error;
                if(rows.length == 0) throw ApiErrors.notFound("huisId");

                // Get first result (there should be only 1 result)
                const studentenhuis = rows[0];
                // Create a StudentenhuisResponse from the DB result and return it
                callback(StudentenhuisResponse.fromDatabaseObject(studentenhuis));
            } catch (error) {
                callback(error, null)
            }
        });
    }

    getStudenthouseResponseFromID(id, callback){
        _db.query(`SELECT * FROM view_studentenhuis WHERE ID = ${id}`, (error, rows, fields) => {
            try {
                if(error) throw error;
                if(rows.length == 0) throw ApiErrors.notFound("huisId");

                // Get first result (there should be only 1 result)
                const studentenhuis = rows[0];
                // Create a StudentenhuisResponse from the DB result and return it
                callback(StudentenhuisResponse.fromDatabaseObject(studentenhuis));
            } catch (error) {
                callback(error, null)
            }
        });
    }

    getStudenthouseFromID(id, callback){
        _db.query(`SELECT * FROM studentenhuis WHERE ID = ${id}`, (error, rows, fields) => {
            try {
                if(error) throw error;
                if(rows.length == 0) throw ApiErrors.notFound("huisId");

                // Get first result (there should be only 1 result)
                const studentenhuis = rows[0];
                // Create a StudentenhuisResponse from the DB result and return it
                callback(studentenhuis);
            } catch (error) {
                callback(error, null)
            }
        });
    }

    updateStudenthouse(studentenhuis, huisId, userID, callback){
        _db.query(`UPDATE studentenhuis SET Naam = ${studentenhuis.naam}, Adres = ${studentenhuis.adres} WHERE ID = ${huisId} AND UserID = ${userID}`, (error, rows, fields) => {
            callback(error, null);
        });
    }

    insertStudenthouse(studentenhuis, userID, callback){
        _db.query(`INSERT INTO studentenhuis (Naam, Adres, UserID) VALUES ('${studentenhuis.naam}', '${studentenhuis.adres}', ${userID})`, (error, rows, fields) => {
            callback(error, null);
        });
    }
}