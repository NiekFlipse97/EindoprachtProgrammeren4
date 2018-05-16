const ApiErrors = require("./ApiErrors.js");
module.exports = class UserRegisterJSON {
    constructor(firstname, lastname, email, password){
        if(!(
            firstname && typeof firstname == "string" && 
            lastname && typeof lastname == "string" && 
            email && typeof email == "string" && 
            password && typeof password == "string"
        ))
            throw ApiErrors.wrongRequestBodyProperties;
        
        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
    }

    static fromJSON(json){
        if(!(object && typeof object == "object"))
            throw ApiErrors.wrongRequestBodyProperties;

        return new UserRegisterJSON(json.firstname, json.lastname, json.email, json.password);
    }
}