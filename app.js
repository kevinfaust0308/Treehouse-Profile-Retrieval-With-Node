var http = require('http');
var router = require('./router');

http.createServer(function (request, response) {
    router.home(request, response);
    router.user(request, response);
}).listen(8080);

console.log('Server running on port 8080');
