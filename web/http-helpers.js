var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.response404 = function(res){
  res.writeHead(404);
  res.end('NOT FOUND');
};

exports.serveAssets = function(res, asset) {
  fs.readFile(this.paths.archivedSites + asset, function(error, content) {
    if (error) {
      this.response404(res);
    } else {
      res.writeHead(200, this.headers);
      res.end(content, 'utf-8');
    }
  });
};

exports.redirect = function(res, url, status){
  status = status || 302;
  res.writeHead(status, {
    'Location': url
  });
  res.end();
};

