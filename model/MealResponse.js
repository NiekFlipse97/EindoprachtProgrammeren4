module.exports = class MealResponse {
    constructor (ID, naam, beschrijving, ingredienten, allergie, prijs){
        if(!(
            ID && typeof ID == "number" &&
            naam && typeof naam == "string" && 
            beschrijving && typeof beschrijving == "string" && 
            ingredienten && typeof ingredienten == "string" && 
            allergie && typeof allergie == "string" && 
            prijs && typeof prijs == "number"
        ))
        console.log("One or more parameters are of the wrong type (MealResponse)!");
            
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