const ApiErrors = require("./ApiErrors.js");
module.exports = class Maaltijd {
    constructor (naam, adres){
        if(!(
            naam && typeof naam == "string" && 
            beschrijving && typeof beschrijving == "string" && 
            ingredienten && typeof ingredienten == "string" && 
            allergie && typeof allergie == "string" && 
            prijs && typeof prijs == "number"
        ))
            throw ApiErrors.wrongRequestBodyProperties;

        this.naam = naam;
        this.beschrijving = beschrijving;
        this.ingredienten = ingredienten;
        this.allergie = allergie;
        this.prijs = prijs;
    }

    static fromJSON(json){
        if(!(json && typeof json == "object"))
            throw ApiErrors.wrongRequestBodyProperties;

        return new Studentenhuis(json.naam, json.beschrijving, json.ingredienten, json.allergie, json.prijs);
    }
}