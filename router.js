var Profile = require("./profile");
var renderer = require('./renderer');
var querystring = require('querystring');


var commonHeader = {'Content-Type':'text/html'};


function home(request, response) {

    //check if we are on the home page
    if (request.url === "/") {
        //are we loading the home page
        if (request.method.toLowerCase() === 'get') {
            response.writeHead(200, commonHeader);
            renderer.view('header', {}, response);
            renderer.view('search', {}, response);
            renderer.view('footer', {}, response);
            response.end();
        //or are we sending a search request on the home page
        } else {

            //on data: we get the hidden POST query string
            //in our case: username = search_name
            request.on('data', function(postBody) {

                //change query string into a key-value pair
                //change from Buffer to String
                var query = querystring.parse(postBody.toString());
                //303 means we want to redirect to a other site. (POST to GET)
                //no longer ContentType but rather location with the query string
                response.writeHead(303, {'Location':'/' + query.username});
                response.end();
            });
        }
    }
}

function user(request, response) {

    var username = request.url.replace("/", "");
    if (username.length > 0) {
        response.writeHead(200, commonHeader);
        renderer.view('header', {}, response);

        var studentProfile = new Profile(username);


        studentProfile.on('end', function (profileJSON) {

            var values = {
                avatarUrl: profileJSON.gravatar_url,
                username: profileJSON.profile_name,
                badges: profileJSON.badges.length,
                JavaScriptPoints: profileJSON.points.JavaScript
            };

            renderer.view('profile', values, response);
            renderer.view('footer', {}, response);
            response.end();
        });


        studentProfile.on('error', function (error) {
            renderer.view('error', {errorMessage:error.message}, response);
            renderer.view('search', {}, response);
            renderer.view('footer', {}, response);
            response.end();
        });

    }
}

module.exports.home = home;
module.exports.user = user;