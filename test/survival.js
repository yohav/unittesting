/**
 * Created by Yoav on 16/12/2016.
 */
process.env.NODE_ENV = 'test';

require('mocha-sinon');
var chai = require('chai');
var chaiHttp = require('chai-http');

var expect = chai.expect;
chai.use(chaiHttp);

describe('Survival', function() {

    it('should throw error when cant connect to mongodb',function(done) {
        this.sinon.stub(require('mongoose'), "connect", function(connectionString, callback){
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