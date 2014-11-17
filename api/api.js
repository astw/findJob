var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

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

//define user model
var User = mongoose.model("User",{
    email:String,
    password: String
});

app.post("/register", function(req, res){
    console.log(req.body);
    var user = req.body;
    var newUser = new User({
        email:user.email,
        password:user.password
    });
    newUser.save(function(err){
        res.status(201).json(newUser);
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
