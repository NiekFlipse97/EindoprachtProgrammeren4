const ApiErrors = require("./ApiErrors.js");
module.exports = class UserRegisterJSON {
    constructor(token, email){
        if(!(
            token && typeof token == "string" && 
            email && typeof email == "string"
        ))
            throw ApiErrors.wrongRequestBodyProperties;
        
        this.token = token;
        this.email = email;
    }
}