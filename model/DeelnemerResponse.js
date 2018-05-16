module.exports = class DeelnemerResponse{
    constructor(voornaam, achternaam, email) {
        this.voornaam = voornaam;
        this.achternaam = achternaam;
        this.email = email
    }

    static fromDatabaseObject(dbObject){
        return new DeelnemerResponse(dbObject.Voornaam, dbObject.Achternaam, dbObject.Email);
    }

};