require("./config.js");

var secret = "this is my secret";

exports.send = function (email) {

    var payload = {
        sub: email
    };

    var token = jwt.encode(payload, config.EMAIL_SECRET);
}