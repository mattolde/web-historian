var path = require('path');
var archive = require('../helpers/archive-helpers');
// var httpHelper = require('../helpers/http-helpers');
var fs = require('fs');
var urlParser = require('url');
var querystring = require('querystring');
// require more modules/folders here!

var response404 = function(res){
  res.writeHead(404);
  res.end('NOT FOUND');
};

var responseHTML = function(res, htmlFile){
  fs.readFile(path.resolve(__dirname,'public', htmlFile), function(error, content) {
    if (error) {
      response404(res);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content, 'utf-8');
    }
  });
};

var redirectTo = function(res, url, status){
  status = status || 301;
  console.log('REDIRECT', url);
  res.writeHead(status, {
    'Location': url
  });
  res.end();
};

exports.handleRequest = function (req, res) {

  var pathname = urlParser.parse(req.url).pathname.split('/');

  console.log("PAGE", req.url);

  if(req.method === 'GET'){

    if(pathname[1] === 'page'){
      console.log("LOADING ARCH");
      var url = pathname.slice(2).join('/');

      archive.getArchivedSite(url, function(filePath){
        if(filePath){
          responseHTML(res, filePath);
        } else {
          redirectTo(res, 'http://127.0.0.1:8080/loading');
        }
      });

    } else {
      var htmlFile = 'index.html';

      if(pathname[1] === 'loading'){
        htmlFile = 'loading.html';
      }
      responseHTML(res, htmlFile);
    }

  } else if (req.method === 'POST'){
    // get data url
    var data = '';

    req.on('data', function(chunk) {
      data += chunk.toString();
    });


    req.on('end', function(){

      var url = querystring.parse(data).url;

      archive.getArchivedSite(url, function(archivedPath){
        if(archivedPath){
          // redirect to page archived url
          redirectTo(res, 'http://127.0.0.1:8080/page/' + url);
        } else {
          console.log('WRITE TO FILE');
          // write to sites.txt
          archive.addUrlToList(url);
          // redirect to loading
          redirectTo(res, 'http://127.0.0.1:8080/loading');
        }
      });
    });

  } else {
    response404(res);
  }

  // res.end(archive.paths.list);
};

