var crypto = require("crypto");

exports.encode = function(payload, secrete){
    var algorithm = "HS256";
    var header = {
        type:"JWT",
        alg:algorithm
    };
    var jwt = base64Encode(JSON.stringify(header)) +"." + base64Encode(JSON.stringify(payload)) ;
    return jwt + '.'+ sign(jwt, secrete);
};

//create an signature function
function sign(str, key){
    return crypto.createHmac("sha256", key).update(str).digest('base64');
}

function base64Encode(str)
{
    return new Buffer(str).toString('base64');
}