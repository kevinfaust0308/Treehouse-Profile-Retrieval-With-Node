var EventEmitter = require("events").EventEmitter;
var https = require("https");
var http = require("http");
var util = require("util");

/**
 * An EventEmitter to get a Treehouse students profile.
 * @param username
 * @constructor
 */
function Profile(username) {

    //every instance of this object will inherit properties/functions of eventEmitter. ex: emit()
    //when saying 'this', it now includes this object + everything from eventEmitter
    EventEmitter.call(this);

    //because if we call "this.emit()" inside a response event listener, "this" refers to the response
    // event listener. we want "this" to always refer to this instance of the
    // object and so we do that here. we dont want our response object to emit an event but rather the object instance
    var profileEmitter = this;

    //Connect to the API URL (https://teamtreehouse.com/username.json)
    var request = https.get("https://teamtreehouse.com/" + username + ".json", function (response) {

        if (response.statusCode === 200) {

            var body = "";


            //Read the data
            response.on('data', function (chunk) {
                body += chunk;
                //example why used profileEmitter instead of 'this'. if we did 'this', the response would emit
                //the 'data' event but the response is also listening to it therefore creating an infinite call
                profileEmitter.emit("data", chunk);
            });

            response.on('end', function () {
                try {
                    //Parse the data
                    var profile = JSON.parse(body);
                    profileEmitter.emit("end", profile);
                } catch (e) {
                    profileEmitter.emit("error", e);
                }
            })
        } else {
            request.abort();
            //Status Code Error
            profileEmitter.emit("error", new Error("There was an error getting the profile for " + username + ". (" + http.STATUS_CODES[response.statusCode] + ")"));
        }
    });

    request.on("error", function (error) {
        profileEmitter.emit("error", error);
    });

}

//Create prototype chain. Profile's prototype will now extend EventEmitter's prototype
//same as doing the following in normal javascript:
//Profile.prototype = Object.create(EventEmitter.prototype);
util.inherits(Profile, EventEmitter);


//when other files require this module, they can use the Profile() constructor to make new objects
module.exports = Profile;