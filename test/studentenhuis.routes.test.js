const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');
const server = require('../main');

chai.should();
chai.use(chaiHttp);

const datetime = moment().unix().toString();

let token;
let testHouseId;
const testHouse = {
    naam: "Testinghouse 1234",
    adres: "Testinglane, testingcity"
};

describe('Studentenhuis API POST', () => {
    if(!token) before(() => {
        chai.request(server)
            .post('/api/login')
            .send({
                email: "test@test.com",
                password: `T3st-${datetime}`
            })
            .end((err, res) => {
                token = res.body.token;
            });
    });

    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(server)
            .post('/api/studentenhuis')
            .set("X-Access-Token", "ABCD")
            .send({})
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done();
            });
    });

    it('should return a studentenhuis when posting a valid object', (done) => {
        chai.request(server)
            .post('/api/studentenhuis')
            .set("X-Access-Token", token)
            .send(testHouse)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('ID');
                res.body.should.have.property('naam');
                res.body.should.have.property('adres');
                res.body.should.have.property('contact');
                res.body.should.have.property('email');
                testHouseId = res.body.ID;
                done();
            });
    });

    it('should throw an error when naam is missing', (done) => {
        chai.request(server)
            .post('/api/studentenhuis')
            .set("X-Access-Token", token)
            .send({
                adres: "Testinglane, testingcity"
            })
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done();
            });
    });

    it('should throw an error when adres is missing', (done) => {
        chai.request(server)
            .post('/api/studentenhuis')
            .set("X-Access-Token", token)
            .send({
                naam: "Testinghouse 1234"
            })
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done();
            });
    })
});

describe('Studentenhuis API GET all', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(server)
            .get('/api/studentenhuis')
            .set("X-Access-Token", "ABCD")
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done();
            });
    });

    it('should return all studentenhuizen when using a valid token', (done) => {
        chai.request(server)
            .get('/api/studentenhuis')
            .set("X-Access-Token", token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    })
});

describe('Studentenhuis API GET one', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(server)
            .get(`/api/studentenhuis/${testHouseId}/`)
            .set("X-Access-Token", "ABCD")
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done();
            });
    });

    it('should return the correct studentenhuis when using an existing huisId', (done) => {
        chai.request(server)
            .get(`/api/studentenhuis/${testHouseId}/`)
            .set("X-Access-Token", token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('ID');
                res.body.should.have.property('naam');
                res.body.should.have.property('adres');
                res.body.should.have.property('contact');
                res.body.should.have.property('email');
                res.body.naam.should.equal(testHouse.naam);
                res.body.adres.should.equal(testHouse.adres);
                done();
            });
    });

    it('should return an error when using an non-existing huisId', (done) => {
        chai.request(server)
            .get(`/api/studentenhuis/1234567890/`)
            .set("X-Access-Token", token)
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done();
            });
    })
});

describe('Studentenhuis API PUT', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(server)
            .put(`/api/studentenhuis/${testHouseId}/`)
            .set("X-Access-Token", "ABCD")
            .send({})
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done();
            });
    });

    it('should return a studentenhuis with ID when posting a valid object', (done) => {
        chai.request(server)
            .put(`/api/studentenhuis/${testHouseId}/`)
            .set("X-Access-Token", token)
            .send({
                naam: "Testinghouse 1234 NEW",
                adres: "Testinglane NEW, testingcity"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('ID');
                res.body.should.have.property('naam');
                res.body.should.have.property('adres');
                res.body.should.have.property('contact');
                res.body.should.have.property('email');
                done();
            });
    });

    it('should throw an error when naam is missing', (done) => {
        chai.request(server)
            .put(`/api/studentenhuis/${testHouseId}/`)
            .set("X-Access-Token", token)
            .send({
                adres: "Testinglane NEW, testingcity"
            })
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done();
            });
    });

    it('should throw an error when adres is missing', (done) => {
        chai.request(server)
            .put(`/api/studentenhuis/${testHouseId}/`)
            .set("X-Access-Token", token)
            .send({
                naam: "Testinghouse 1234 NEW"
            })
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done();
            });
    })
});

describe('Studentenhuis API DELETE', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(server)
            .delete(`/api/studentenhuis/${testHouseId}/`)
            .set("X-Access-Token", "ABCD")
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('datetime');
                done();
            });
    });

    // These are the wrong tests
    /*it('should return a studentenhuis when posting a valid object', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done();
    });

    it('should throw an error when naam is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done();
    });

    it('should throw an error when adres is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done();
    })*/
});