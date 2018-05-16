module.exports = class StudentenhuisResponse {
    constructor (ID, naam, adres, contact, email){
        if(!(
            ID && typeof ID == "number" &&
            naam && typeof naam == "string" && 
            adres && typeof adres == "string" &&
            contact && typeof contact == "string" && 
            email && typeof email == "string"
        ))
        console.log("One or more parameters are of the wrong type (StudentenhuisResponse)!");

        this.ID = ID;
        this.naam = naam;
        this.adres = adres;
        this.contact = contact;
        this.email = email;
    }

    static fromDatabaseObject(dbObject){
        return new StudentenhuisResponse(dbObject.ID, dbObject.Naam, dbObject.Adres, dbObject.Contact, dbObject.Email);
    }
}