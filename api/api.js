var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var User = require("./models/User.js");
var jwt = require("./services/jwt.js");

var app = express();
// to enable access json data in request body
app.use(bodyParser.json());

// to enable cors
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers","Content-Type,Authorization");
    next();
})


app.post("/register", function(req, res){
    console.log(req.body);
    var user = req.body;
    var newUser = new User.model({
        email:user.email,
        password:user.password
    });

    var payload ={
        iss:req.hostname,
        sub:user._id
    };

    var token = jwt.encode(payload,"hard-code temporary") ;

    newUser.save(function(err) {
        res.status(201).send({
            user: newUser.toJSON(),
            token: token
        });
    });
});

// connect to mongo db

mongoose.connect("mongodb://localhost:27017/psjwt");
var db = mongoose.connection;
db.on("error", console.error.bind(console,"connecting error"));
db.on("open", function callback(){
    console.log("connecting to db succeed");
});

var server = app.listen(3000, function(){
    console.log("API is listening on " + server.address().port + "......");
});
