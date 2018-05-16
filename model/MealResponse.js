module.exports = class MealResponse {
    constructor (ID, naam, beschrijving, ingredienten, allergie, prijs){
        this.ID = ID;
        this.naam = naam;
        this.beschrijving = beschrijving;
        this.ingredienten = ingredienten;
        this.allergie = allergie;
        this.prijs = prijs;
    }

    static fromDatabaseObject(dbObject){
        return new MealResponse(dbObject.ID, dbObject.Naam, dbObject.Beschrijving, dbObject.Ingredienten, dbObject.Allergie, dbObject.Prijs);
    }
};