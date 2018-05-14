const ApiError = require("./ApiError.js");

module.exports = class ApiErrors {
    static get notAuthorised(){
        return new ApiError("Niet geautoriseerd (geen valid token)", 401);
    }

    static get wrongRequestBodyProperties(){
        return new ApiError("Een of meer properties in de request body ontbreken of zijn foutief", 412);
    }

    static notFound(objectName){
        return new ApiError(`Niet gevonden (${objectName} bestaat niet)`, 404);
    }

    static conflict(message){
        return new ApiError(`Conflict (${message})`, 409);
    }
}