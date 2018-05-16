const ApiErrors = require("./ApiErrors.js");
module.exports = class UserLoginJSON {
    constructor(email, password){
        if(!(
            email && typeof email == "string" && 
            password && typeof password == "string"
        ))
            throw ApiErrors.wrongRequestBodyProperties;
        
        this.email = email;
        this.password = password;
    }

    static fromJSON(json){
        if(!(object && typeof object == "object"))
            throw ApiErrors.wrongRequestBodyProperties;

        return new UserLoginJSON(json.email, json.password);
    }
}