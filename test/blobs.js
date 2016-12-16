/**
 * Created by Yoav on 16/12/2016.
 */

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require("mongoose");

var app, server;

var Blob = require("../server/models/blob");

var should = chai.should();
chai.use(chaiHttp);

describe('Blobs', function() {

    Blob.collection.drop();

    before(function(){
        var module = require('../server/app');
        server = module.server;
        app = module.app;
    });

    after(function(){
        server.close();
    });

    beforeEach(function(done){
        var newBlob = new Blob({
            name: 'Bat',
            lastName: 'man'
        });
        newBlob.save(function(err) {
            done();
        });
    });
    afterEach(function(done){
        Blob.collection.drop();
        done();
    });

    it('should return Hello World on / GET',function(done) {
        chai.request(app)
            .get('/')
            .end(function (err, res) {
                res.should.have.status(200);
                res.text.should.be.string("Hello, World!");
                done();
            });
    });


    it('should list ALL blobs on /blobs GET', function(done) {
        chai.request(app)
            .get('/blobs')
            .end(function(err, res){
                res.should.have.status(200);
                //noinspection BadExpressionStatementJS
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0].should.have.property('lastName');
                res.body[0].name.should.equal('Bat');
                res.body[0].lastName.should.equal('man');
                done();
            });
    });

    it('should list a SINGLE blob on /blob/<id> GET', function(done){
        var newBlob = new Blob({
           name: "Super",
            lastName: "Man"
        });
        newBlob.save(function(err, data){
           chai.request(app)
               .get('/blob/' + data.id)
               .end(function(err, res){
                   res.should.have.status(200);
                   //noinspection BadExpressionStatementJS
                   res.should.be.json;
                   res.should.be.a('object');
                   res.body.should.have.property('_id');
                   res.body.should.have.property('name');
                   res.body.should.have.property('lastName');
                   res.body.name.should.equal('Super');
                   res.body.lastName.should.equal('Man');
                   res.body._id.should.equal(data.id);
                   done();
               });
        });
    });

    it('should add a SINGLE blob on /blobs POST', function(done) {
        chai.request(app)
            .post('/blobs')
            .send({'name': 'Java', 'lastName': 'Script'})
            .end(function(err, res){
                res.should.have.status(200);
                //noinspection BadExpressionStatementJS
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('SUCCESS');
                res.body.SUCCESS.should.be.a('object');
                res.body.SUCCESS.should.have.property('name');
                res.body.SUCCESS.should.have.property('lastName');
                res.body.SUCCESS.should.have.property('_id');
                res.body.SUCCESS.name.should.equal('Java');
                res.body.SUCCESS.lastName.should.equal('Script');
                done();
            });
    });

    it('should update a SINGLE blob on /blob/<id> PUT', function(done) {
        chai.request(app)
            .get('/blobs')
            .end(function(err, res){
                chai.request(server)
                    .put('/blob/' + res.body[0]._id)
                    .send({'name': 'Spider'})
                    .end(function(error, response){
                        response.should.have.status(200);
                        //noinspection BadExpressionStatementJS
                        response.should.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('UPDATED');
                        response.body.UPDATED.should.be.a('object');
                        response.body.UPDATED.should.have.property('name');
                        response.body.UPDATED.should.have.property('_id');
                        response.body.UPDATED.name.should.equal('Spider');
                        done();
                    });
            });
    });

    it('should delete a SINGLE blob on /blob/<id> DELETE', function(done) {
        chai.request(server)
            .get('/blobs')
            .end(function(err, res){
                chai.request(server)
                    .delete('/blob/' + res.body[0]._id)
                    .end(function(error, response){
                        response.should.have.status(200);
                        //noinspection BadExpressionStatementJS
                        response.should.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('REMOVED');
                        response.body.REMOVED.should.be.a('object');
                        response.body.REMOVED.should.have.property('name');
                        response.body.REMOVED.should.have.property('_id');
                        response.body.REMOVED.name.should.equal('Bat');
                        done();
                    });
            });
    });
});