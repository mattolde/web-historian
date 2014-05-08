var path = require('path');
var archive = require('../helpers/archive-helpers');
var response = require('./http-helpers.js');
var fs = require('fs');
var urlParser = require('url');
var querystring = require('querystring');

exports.handleRequest = function (req, res) {

  var pathname = urlParser.parse(req.url).pathname.split('/');

  if(req.method === 'GET'){

    if(pathname[1] === 'page'){
      var url = pathname.slice(2).join('/');

      archive.getArchivedSite(url, function(filePath){
        if(filePath){
          response.serveAssets(res, filePath);
        } else {
          response.redirect(res, 'http://127.0.0.1:8080/loading');
        }
      });

    } else {
      var htmlFile = 'index.html';

      if(pathname[1] === 'loading'){
        htmlFile = 'loading.html';
      }
      response.serveAssets(res, htmlFile);
    }

  } else if (req.method === 'POST'){

    var data = '';

    req.on('data', function(chunk) {
      data += chunk.toString();
    });

    req.on('end', function(){

      var url = querystring.parse(data).url;

      archive.getArchivedSite(url, function(archivedPath){
        if(archivedPath){
          // redirect to page archived url
          response.redirect(res, 'http://127.0.0.1:8080/page/' + url);
        } else {
          // write to sites.txt
          archive.addUrlToList(url);
          // redirect to loading
          response.redirect(res, 'http://127.0.0.1:8080/loading');
        }
      });
    });

  } else {
    response404(res);
  }
};

