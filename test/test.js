var assert = require('assert');

var plugin = require('../lib/plugin');

describe('plugin', function() {
    describe('#getConfig()', function() {
        it('should return set config content', function() {
            plugin.set('app_name', 'test_api');
            var config = plugin.getConfig()
            assert.equal('test_api', config.app_name);
        });
    });

    describe('#runTest()', function() {
        it('should run the test in 10 seconds', function(done) {
            this.timeout(11000);
            plugin.runTest(done, 10);
        })
    });
});

describe('email', function() {
    describe('#emailLog()', function() {
        it('try to send an email', function(done) {
            this.timeout(10000);

            var passed = true;
            success = function() {
                done();
            }

            fail =  function(error) {
                console.log(error);
                assert.fail('send email failed');
                done();
            };

            plugin.sendEmail('test title', 'test content', success, fail);
        });
    });
});
