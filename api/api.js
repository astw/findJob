var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var User = require("./models/User.js");
//var jwt = require("./services/jwt.js");
var passport = require("passport");
var LocalStrategy = require("password-local").Strategy;


var jwt = require("jwt-simple");

var app = express();
app.use(passport.initialize());
passport.serializeUser(function(user,done){
   done(null, user.id);
});

// to enable access json data in request body
app.use(bodyParser.json());

var strategy = new LocalStrategy({usernameField:'email'}, function(email, password, done){
    var searchUser ={
        email:email
    }
    User.findOne(searchUser, function(err, user) {
        if (err) return done(err);

        if(!user){
           return done(null,false,{message:"Wrong email/password matching."})
        }

        user.comparePasswords(password, function(err, isMatch) {
            if (err) return done(err);

            if(!isMatch)
                return done(null,false,{message:"Wrong email/password matching."})

            return done(null, user);
        });
    })
});
passport.use(strategy);
// to enable cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    next();
});

var secret = "this is my secret";

app.post("/register", function(req, res) {
    console.log(req.body);
    var user = req.body;
    var newUser = new User({
        email: user.email,
        password: user.password
    }); 

    newUser.save(function(err) {
        createSendToken(newUser,res);
    });
});

var jobs = [
    'Cook',
    'SupperHero',
    'Unicorn Wisperer',
    'Toast Inspector'
];

app.get("/jobs", function(req, res) {
    console.log(JSON.stringify(req.headers));

    if (!req.headers.authorization) {
        return res.status(401).send({
            message: "You are not authorized"
        });
    }

    var token = req.headers.authorization.split(" ")[1];
    var payload = jwt.decode(token, secret);

    if (!payload.sub) {
        res.status(401).send({
            message: "Authentication failed"
        });
    }
    res.json(jobs);
});

app.post("/login", function(req, res, next) {

    passport.authenticate("local", function(err, user){
        if(err) next(err);

        req.login(user, function(err){
            if(err) next(err);

            createSendToken(user,res);
        })
    })(req, res,next);

 /*  var req_user = req.body;
    var searchUser = {email:req_user.email};
    User.findOne(searchUser, function(err, user) {
        if (err) throw err;

        if(!user){
            res.status(401).send({message:"Wrong email/password matching."})
        }

        user.comparePasswords(req_user.password, function(err, isMatch) {
            if (err) throw err;

            if(!isMatch)
              return  res.status(401).send({message:"Wrong email/password matching."})

            createSendToken(user,res);
        });
    })
    */
});

function createSendToken(user, res) {
    var payload = {
        //iss: req.hostname,
        sub: user.id
    };

    var token = jwt.encode(payload, secret);

    res.status(201).send({
        user: user.toJSON(),
        token: token
    });
}


// connect to mongo db

mongoose.connect("mongodb://localhost:27017/psjwt");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connecting error"));
db.on("open", function callback() {
    console.log("connecting to db succeed");
});

var server = app.listen(3000, function() {
    console.log("API is listening on " + server.address().port + "......");
});
