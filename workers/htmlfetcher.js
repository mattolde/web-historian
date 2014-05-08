// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.

var http = require("http");
var archive = require('../helpers/archive-helpers');


var handleRequest = function(){
  archive.downloadUrls();
}();

var port = 9080;
var ip = "127.0.0.1";
var server = http.createServer(handleRequest);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

