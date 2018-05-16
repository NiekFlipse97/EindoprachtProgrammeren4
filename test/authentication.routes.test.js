/**
 * Testcases aimed at testing the authentication process. 
 */
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const moment = require('moment');
const server = require('../main');

chai.should();
chai.use(chaiHttp);

// After successful registration we have a valid token. We export this token
// for usage in other testcases that require login.
let validToken;

const datetime = moment().unix().toString();

describe('Registration', () => {
    it('should return a token when providing valid information', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                firstname: "Test",
                lastname: datetime,
                email: "test@test.com",
                password: `T3st-${datetime}`
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                res.body.should.have.property('email');
                validToken = res.body.token;
                module.exports = {
                    token: validToken
                };
                done()
            });
    });

    it('should return an error on GET request', (done) => {
        chai.request(server)
            .get('/api/register')
            .end((err, res) => {
                res.should.have.status(404);
                done()
            });
    });

    it('should throw an error when the user already exists', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                firstname: "Test",
                lastname: datetime,
                email: "test@test.com",
                password: `T3st-${datetime}`
            })
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done()
            });
    });

    it('should throw an error when no firstname is provided', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                lastname: datetime,
                email: "test@test.com",
                password: `T3st-${datetime}`
            })
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done()
            });
    });

    it('should throw an error when firstname is shorter than 2 chars', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                firstname: "X",
                lastname: datetime,
                email: "test@test.com",
                password: `T3st-${datetime}`
            })
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done()
            });
    });

    it('should throw an error when no lastname is provided', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                firstname: "Test",
                email: "test@test.com",
                password: `T3st-${datetime}`
            })
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done()
            });
    });

    it('should throw an error when lastname is shorter than 2 chars', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                firstname: "Test",
                lastname: "X",
                email: "test@test.com",
                password: `T3st-${datetime}`
            })
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done()
            });
    });

    it('should throw an error when email is invalid', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                firstname: "Test",
                lastname: datetime,
                email: "blabla1234",
                password: `T3st-${datetime}`
            })
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done()
            });
    });

});

describe('Login', () => {

    it('should return a token when providing valid information', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    });

    it('should throw an error when email does not exist', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    });

    it('should throw an error when email exists but password is invalid', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    });

    it('should throw an error when using an invalid email', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

});