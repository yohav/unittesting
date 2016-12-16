/**
 * Created by Yoav on 16/12/2016.
 */
process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var app, server;

var Blob = require("../server/models/blob");
var ObjectId = require('mongoose').Types.ObjectId;

var sinon;
var should = chai.should();
chai.use(chaiHttp);

describe('Errors', function() {

    Blob.collection.drop();

    before(function(){
        var module = require('../server/app');
        server = module.server;
        app = module.app;
    });

    after(function(){
        server.close();
    });

    beforeEach(function(done) {
        sinon = require('sinon').sandbox.create();
        var newBlob = new Blob({
            name: 'Bat',
            lastName: 'man'
        });
        newBlob.save(function(err) {
            done();
        });
    });

    afterEach(function(done){
        sinon.restore();
        Blob.collection.drop();
        done();
    });


    it('should return Error on GET /blob/{id} GET when id is not valid',function(done) {
        chai.request(app)
            .get('/blob/123')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('ERROR');
                done();
            });
    });

    it('should return Error on GET /blob/{id} GET when id not exists',function(done) {
        chai.request(app)
            .get('/blob/' + ObjectId().toHexString())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('ERROR');
                res.body.ERROR.should.be.equal("NotExists");
                done();
            });
    });

    it('should return Error on PUT /blob/{id} when id is not valid', function(done){
        chai.request(app)
            .put('/blob/123')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('ERROR');
                done();
            });
    });

    it('should return Error on PUT /blob/{id} when id not exists', function(done){
        chai.request(app)
            .put('/blob/' + ObjectId().toHexString())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('ERROR');
                res.body.ERROR.should.be.equal("NotExists");
                done();
            });
    });

    it('should return Error on DELETE /blob/{id} when id not valid', function(done){
        chai.request(app)
            .delete('/blob/123')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('ERROR');
                done();
            });
    });

    it('should return Error on DELETE /blob/{id} when id not exists', function(done){
        chai.request(app)
            .delete('/blob/' + ObjectId().toHexString())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('ERROR');
                res.body.ERROR.should.be.equal("NotExists");
                done();
            });
    });

    it('should return Error on PUT /blob/{id} when cant save', function(done){
        sinon.stub(require('mongoose').Model.prototype, "save", function(callback){
            callback({err: true});
        });

        chai.request(app)
            .get('/blobs')
            .end(function(err, res){
                chai.request(server)
                    .put('/blob/' + res.body[0]._id)
                    .send({'name': 'Spider'})
                    .end(function(error, res){
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('ERROR');
                        done();
                    });
            });
    });

    it('should return Error on POST /blobs when cant save', function(done){
        sinon.stub(require('mongoose').Model.prototype, "save", function(callback){
            callback({err: true});
        });
        chai.request(server)
            .post('/blobs')
            .send({name: 'Spider', lastName: 'Man'})
            .end(function(error, res){
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('ERROR');
                done();
            });
    });

    it('should return Error on GET /blobs when cant find', function(done){
        sinon.stub(Blob, "find", function(callback){
            callback({err: true});
        });
        chai.request(server)
            .get('/blobs')
            .end(function(error, res){
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('ERROR');
                done();
            });
    });

    it('should return Error on DELETE /blob/{id} when cant remove', function(done){
        sinon.stub(require('mongoose').Model.prototype, "remove", function(callback){
            callback({err: true});
        });
        chai.request(app)
            .get('/blobs')
            .end(function(err, res){
                chai.request(server)
                    .delete('/blob/' + res.body[0]._id)
                    .end(function(error, res){
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('ERROR');
                        done();
                    });
            });
    });
});