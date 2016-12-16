/**
 * Created by Yoav on 16/12/2016.
 */
process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var expect = chai.expect;
var sinon;
chai.use(chaiHttp);

describe('Survival', function() {

    beforeEach(function() {
        sinon = require('sinon').sandbox.create();
    });

    afterEach(function(){
        sinon.restore();
    });

    it('should throw error when cant connect to mongodb',function(done) {
        sinon.stub(require('mongoose'), "connect", function(connectionString, callback){
            callback({err: true});
        });
        expect(function(){
            requireUncached('../server/app');
        }).to.throw();
        done();
    });
});

function requireUncached(module){
    delete require.cache[require.resolve(module)];
    return require(module)
}