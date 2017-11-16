# centaurs-test-plugin

## Adding dependency

Add the following line to package.json

~~~~ json
"dependencies": {
    "centaurs-test-plugin": "git+https://github.com/yiwangcentaurs/centaurs-test-plugin.git",
    ...
}
~~~~

## Using plugin

~~~~ javascript
var plugin = require('centaurs-test-plugin');
// set app name
plugin.set('app_name', 'xxx_api');
// show configuration
plugin.showConfig();
// send system info at specified intervals
plugin.sysCheck(60);
// run a test and report an error
plugin.runTest(function(){throw new Error('xxx error');}, 60);
// send an email
plugin.emailClient.emailLog('test title', 'test content', funcion(error){ });
~~~~

## Writing configuration files

Email configurations (save in development.json)

~~~~ json
"email": {
    "username": "xxx@xxx.xxx",
    "password": "xxxxxxxxx",
    "domain": "smtp.xxx.com"
}
~~~~

## Loading configurations

Add the following code to vscode launch.json to feed ENV paramter

~~~~ json
"env": {
    "NODE_ENV": "development"
},
~~~~

Use following commands to feed ENV paramter to forever

`user: $ NODE_ENV="production" forever --uid "xxx" -a start xxx.js`

or

`user: $ NODE_ENV="production" forever --uid "xxx" -a start -c "npm start" ./`

## Test

Run test cases

`npm test`