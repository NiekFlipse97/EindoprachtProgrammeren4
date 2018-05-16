const ApiErrors = require("./ApiErrors.js");
const Isemail = require('isemail');
module.exports = class UserRegisterJSON {
    constructor(firstname, lastname, email, password){
        if(!(
            firstname && typeof firstname == "string" && firstname.length >= 2 &&
            lastname && typeof lastname == "string" && lastname.length >= 2 &&
            email && typeof email == "string" && Isemail.validate(email) &&
            password && typeof password == "string"
        ))
            throw ApiErrors.wrongRequestBodyProperties;
        
        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
    }

    static fromJSON(json){
        if(!(json && typeof json == "object"))
            throw ApiErrors.wrongRequestBodyProperties;

        return new UserRegisterJSON(json.firstname, json.lastname, json.email, json.password);
    }
}