var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var User = require("./models/User.js");
//var jwt = require("./services/jwt.js");

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var request = require("request");
var moment = require("moment");
var facebookAuth = require("./services/facebookAuth.js");
var jwt = require("jwt-simple");
var createSendToken = require("./services/jwt").createSendToken;

var app = express();
app.use(passport.initialize());
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// to enable access json data in request body
app.use(bodyParser.json());

var strategyOptions = {
    usernameField: "email"
};

var loginStrategy = new LocalStrategy(strategyOptions, function (email, password, done) {
    var searchUser = {
        email: email
    }
    User.findOne(searchUser, function (err, user) {
        if (err) return done(err);

        if (!user) {
            return done(null, false, {
                message: "Wrong email/password matching."
            })
        }

        user.comparePasswords(password, function (err, isMatch) {
            if (err) return done(err);

            if (!isMatch)
                return done(null, false, {
                    message: "Wrong email/password matching."
                })

            return done(null, user);
        });
    })
});

var registerStrategy = new LocalStrategy(strategyOptions, function (email, password, done) {
    var searchUser = {
        email: email
    };
    User.findOne(searchUser, function (err, user) {
        if (err) return done(err);

        if (user) {
            return done(null, false, {
                message: "Email already exists"
            })
        };

        var newUser = new User({
            email: email,
            password: password
        });

        newUser.save(function (err) {
            done(null, newUser);
        });
    });
});
//local-register is the customerized name
passport.use("local-register", registerStrategy);
passport.use("local-login", loginStrategy);
// to enable cors
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    next();
});

var secret = "this is my secret";

// passport.authenticate("local-register") is the middleware.
app.post("/register", passport.authenticate("local-register"), function (req, res) {

    createSendToken(req.user, res);

    //    function(req, res) {
    //    console.log(req.body);
    //    var user = req.body;
    //    var newUser = new User({
    //        email: user.email,
    //        password: user.password
    //    });
    //
    //    newUser.save(function(err) {
    //        createSendToken(newUser,res);
    //    });
});

app.post("/auth/facebook", facebookAuth);

var jobs = [
    'Cook',
    'SupperHero',
    'Unicorn Wisperer',
    'Toast Inspector'
];

app.get("/jobs", function (req, res) {
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


app.post("/auth/google", function (req, res) {
    console.log(req.body.code);
    var url = 'https://accounts.google.com/o/oauth2/token';
    var apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

    var params = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        code: req.body.code,
        grant_type: 'authorization_code',
        client_secret: "5bf3umJ0BS7AdqoAOG9xAMUG"
    };
    request.post(url, {
        json: true,
        form: params
    }, function (err, response, token) {
        var accessToken = token.access_token;

        var headers = {
            Authorization: 'Bearer ' + accessToken
        };

        request.get({
            url: apiUrl,
            headers: headers,
            json: true
        }, function (err, response, profile) {
            console.log(profile);

            User.findOne({
                googleId: profile.sub
            }, function (err, founderUser) {
                if (founderUser) return createSendToken(founderUser, res);

                var newUser = new User();
                newUser.googleId = profile.sub;
                newUser.displayName = profile.name;
                newUser.save(function (er) {
                    if (err) {
                        return next(err);
                    };
                    createSendToken(newUser, res);
                });

            });
        });

    });

});

app.post("/login", passport.authenticate("local-login"), function (req, res) {

    createSendToken(req.user, res);

    /*function(req, res, next) {

    passport.authenticate("local", function(err, user){
        if(err) next(err);

        req.login(user, function(err){
            if(err) next(err);

            createSendToken(user,res);
        })
    })(req, res,next);
    */

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
        sub: user.id,
        exp: moment().add(10, 'days').unix()
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

var server = app.listen(3000, function () {
    console.log("API is listening on " + server.address().port + "......");
});