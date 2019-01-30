var express = require('express');
var app = express();

var fs = require('fs');
var morgan = require('morgan');
var path = require('path');

const cors = require('cors')

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/public'));

app.use(cors());

var healthStarRoute = require('./routes/health-star/health-star');
var personsRoute = require('./routes/persons/persons');



app.use('/api/health-star/', healthStarRoute);
app.use('/api/persons/', personsRoute);


app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});
