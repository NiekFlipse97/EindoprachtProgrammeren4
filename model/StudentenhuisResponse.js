module.exports = class StudentenhuisResponse {
    constructor (ID, naam, adres, contact, email){
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