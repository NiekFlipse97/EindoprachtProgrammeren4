const ApiErrors = require("./ApiErrors.js");
module.exports = class Studentenhuis {
    constructor (naam, adres){
        if(!(
            naam && typeof naam == "string" && 
            adres && typeof adres == "string"
        ))
            throw ApiErrors.wrongRequestBodyProperties;

        this.naam = naam;
        this.adres = adres;
    }

    static fromJSON(json){
        if(!(json && typeof json == "object"))
            throw ApiErrors.wrongRequestBodyProperties;

        return new Studentenhuis(json.naam, json.adres);
    }
}