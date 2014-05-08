var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpRequest = require('http-request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  // read sites file
  fs.readFile(this.paths.list, {encoding: 'utf-8'}, function(err, data) {
    if (err) throw err;
    callback(data);
  });
};

exports.isUrlInList = function(url, callback){
  // check if site is in file
  this.readListOfUrls(function(data) {
    data = data.split('\n');
    callback(_.contains(data, url));
  });
};

exports.addUrlToList = function(url){
  var self = this;
  this.isUrlInList(url, function(exists) {
    if (!exists) {
      fs.open(self.paths.list, 'a', function(err, fd) {
        if (err) throw err;
        fs.write(fd, url + '\n', null, null, null, function() {
          fs.close(fd);
        });
      });
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.exists(path.join(this.paths.archivedSites, url), callback);
};

exports.getArchivedSite = function(url, callback) {
  var that = this;
  this.isUrlArchived(url, function(exists) {
    if (exists) {
      callback(path.join(that.paths.archivedSites, url));
    } else callback(null);
  });
};

exports.downloadUrls = function(){

  var self = this;

  this.readListOfUrls(function(data){
    data = data.split('\n');

    _(data).each(function(url) {

      self.isUrlArchived(url, function(exists){
        if(!exists){

          httpRequest.get('http://' + url, function (err, res) {
            if (err) {
              console.error(err);
              return;
            }

            var html = res.buffer.toString();

            // create a archive file

            fs.writeFile(self.paths.archivedSites + '/' +url, html);

          });
        }
      });
    });

  });

};
