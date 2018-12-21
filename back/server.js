var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();

var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://punch:punch@localhost:5430/postgres");

// app.use(function (req, res, next) {
//     if(req.path.includes('/api/')){
//       res.header('Content-Type', 'application/json');
//     } else {
//       res.header('Content-Type', 'text/html');
//     }
//     next();
// });

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/public'));

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

app.get('/api/', function (req, res) {
    res.send(JSON.stringify(persons));
});

// attrs: filter:string
app.get('/api/products', function (req, res) {

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

app.get('/api/products/all', function (req, res) {

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

app.post('/api/', function(req, res) {
    lastId += 1;
    req.body.id = lastId;
    persons.push(req.body);
    res.send("OK")
});

app.get('/api/places/:x/:y/:r', function (req, res) {

    var response = {
        result : req.params.x + req.params.y + req.params.r
    }

    res.send(JSON.stringify(response));
});

app.get('/api/report', function (req, res) {

  db.query("SELECT * from report")
      .then(function (data) {
        console.log("DATA:", data);

        var processed = data.map(row => mapToReportDataset(row));

        res.send(JSON.stringify(processed));
      })
      .catch(function (error) {
        res.send([{name: 'default', data: [1,2,3,4,5,6,7]}]);
      });


});

var mapToReportDataset = function(row){
  var result = {"name": row.name, "data": []}

  result.data.push(row.monday);
  result.data.push(row.tuesday);
  result.data.push(row.wednesday);
  result.data.push(row.thursday);
  result.data.push(row.friday);
  result.data.push(row.saturday);
  result.data.push(row.sunday);

  return result;
};

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});
