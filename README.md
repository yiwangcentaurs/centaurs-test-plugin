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

// catch and report all expected error traces
plugin.catchErr();

// record route request time and send to server
app.use(plugin.timer.start);
/* CAUTION: all route function need to add
 * a parameter 'next' to support this plugin, like
 * exports.route_1 = function (req, res, next) {} */
app.get('/api/path_1', route_1);
app.get("/api/path_2", route_2);
app.use(plugin.timer.stop);

// send an email
plugin.sendEmail('test title', 'test content', function(){'success'}, function(error){ });

~~~~

## Writing configuration files

Make a `config` folder, save configuration file into it.

Email and plugin configurations (save in `development.json`)

~~~~ json
"email": {
    "username": "xxx@xxx.xxx",
    "password": "xxxxxxxxx",
    "domain": "smtp.xxx.com"
},
"plugin": {
    "host": "localhost",
    "port": 10021,
    "app_name": "xxxx-api"
},
"debug": true
~~~~

After deployed on serve, make a new configuartion file named `production.json`.

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
