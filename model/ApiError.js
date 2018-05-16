const ApiErrors = require("./ApiErrors.js");
module.exports = class ApiError {
    constructor(message, code){
        if(!(
            message && typeof message == "string" &&
            code && typeof code == "number"
        ))
            throw ApiErrors.wrongRequestBodyProperties;

        this.message = message;
        this.code = code;
        this.datetime = new Date().toISOString();
    }
};