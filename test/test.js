var assert = require('assert');

var plugin = require('../lib/plugin');

describe('plugin', () => {
    describe('#getConfig()', () => {
        it('should return set config content', function() {
            plugin.set('app_name', 'test_api');
            var config = plugin.getConfig()
            assert.equal('test_api', config.app_name);
        });
    });
});
