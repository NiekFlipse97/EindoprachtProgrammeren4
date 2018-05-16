module.exports = class DeelnemerResponse {
    constructor(voornaam, achternaam, email) {
        if(!(
            voornaam && typeof voornaam == "string" && 
            achternaam && typeof achternaam == "string" && 
            email && typeof email == "string"
        ))
            console.log("One or more parameters are of the wrong type (DeelnemerResponse)!");
            
        this.voornaam = voornaam;
        this.achternaam = achternaam;
        this.email = email
    }

    static fromDatabaseObject(dbObject){
        return new DeelnemerResponse(dbObject.Voornaam, dbObject.Achternaam, dbObject.Email);
    }

};