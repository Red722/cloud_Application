
var express = require('express');

var app = express();

require('./config')(app);

require('./routes')(app);

const port = process.env.PORT || 3000;
app.listen(port);
console.log('Your application is running');
