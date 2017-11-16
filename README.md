# centaurs-test-plugin

## Adding dependency

`"centaurs-test-plugin": "git+https://github.com/yiwangcentaurs/centaurs-test-plugin.git",`

## Using plugin

~~~~ javascript
var plugin = require('centaurs-test-plugin');
plugin.set('app_name', 'xxx_api');
plugin.showConfig();
plugin.sysCheck(2000);
plugin.runTest(function(){throw new Error('xxx error');}, 2000)
plugin.runTest(function(){console.log();}, 2000)
~~~~

## Loading configurations

Add the following code to vscode launch.json to feed ENV paramter

~~~~ json
"env": {
    "NODE_ENV": "development"
},
~~~~

Use following commands to feed ENV paramter to forever

`NODE_ENV="production" forever --uid "xxx" -a start xxx.js`

or

`NODE_ENV="production" forever --uid "xxx" -a start -c "npm start" ./`
