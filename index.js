
var express = require('express');

var app = express();

require('./config')(app);

require('./routes')(app);

app.listen(3333);
console.log('Your application is running on http://localhost:3333');
