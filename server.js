var express = require('express');
var app = express();

app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

var persons = [
    {
        id: 1,
        name: "Vasya",
        age: 21
    },
    {
        id: 2,
        name: "Petya",
        age: 43
    },
    {
        id: 3,
        name: "Misha",
        age: 13
    }

]

var lastId = 3;

app.get('/', function (req, res) {

    res.send(JSON.stringify(persons));
});

app.post('/', function(req, res) {
    lastId += 1;
    req.body.id = lastId;
    persons.push(req.body)
    res.send("OK")
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});