module.exports = class ApiErrors {
    static get notAuthorised(){
        return new ApiError("Niet geautoriseerd (geen valid token)", 401);
    }

    static get wrongRequestBodyProperties(){
        return new ApiError("Een of meer properties in de request body ontbreken of zijn foutief", 412);
    }
}