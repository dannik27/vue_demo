var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();
// const translate = require('google-translate-api');
// const translate = require('translate-api');
var translate = require('yandex-translate')('trnsl.1.1.20181213T061454Z.34ecaf0bbab30a88.2ffdf7eea96263393f591f2857006c3ff57972d8');

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

// attrs: filter:string
app.get('/products', function (req, res) {

    var filter = req.query.filter;
    filter = filter
        .replace("!", "!!")
        .replace("%", "!%")
        .replace("_", "!_")
        .replace("[", "![");


    var db = new sqlite3.Database('usda.sql3');

    db.serialize(function() {

        var query = "select long_desc from food where long_desc like ? escape '!' limit 20";

        var response = [];

        db.each(query, ['%' + filter + '%'] ,
            function(err, row) {

                response.push(mapToProduct(row.long_desc))

                // res.send(JSON.stringify(data.map(item=>mapToProduct(item.long_desc))));
            },
            function () {
                res.send(response.sort((a, b) => a.rating < b.rating ? 1 : -1))
            });
    });

    db.close();

});

app.get('/products/all', function (req, res) {



    var db = new sqlite3.Database('usda.sql3');

    db.serialize(function() {

        var query = "select long_desc from food";

        db.all(query,
            function(err, data) {

                // response.send(mapToProduct(row.long_desc))

                res.send(JSON.stringify(data.map(item=>mapToProduct(item.long_desc))));
            });
    });

    db.close();

});

var mapToProduct = function(name){
    return {"name": name, "rating": getRandomRating(1, 10)};
};

function getRandomRating(min, max) {
    return (Math.floor(Math.random() * (max*2 - min)) + min) / 2;
}

app.post('/', function(req, res) {
    lastId += 1;
    req.body.id = lastId;
    persons.push(req.body);
    res.send("OK")
});

app.get('/places/:x/:y/:r', function (req, res) {

    var response = {
        result : req.params.x + req.params.y + req.params.r
    }

    res.send(JSON.stringify(response));
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});