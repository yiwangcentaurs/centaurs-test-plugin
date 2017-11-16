# centaurs-test-plugin

## Adding dependency

`"centaurs-test-plugin": "git+https://github.com/yiwangcentaurs/centaurs-test-plugin.git",`

## Using plugin

~~~~ javascript
var plugin = require('centaurs-test-plugin');
plugin.set('app_name', 'xxx_api');
plugin.showConfig();
plugin.sysCheck(2000);
plugin.runTest(function(){throw new Error('xxx error');}, 60);
plugin.runTest(function(){console.log();}, 20);
plugin.emailClient.emailLog('test title', 'test content', funcion(error){ });
~~~~

## Writing configuration files

Email configurations

~~~~ yaml
email:
    username: xxx@xxx.xxx
    password: xxxxxxxxx
    domain: smtp.xxx.com
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

## Test

Run test cases

`npm test`