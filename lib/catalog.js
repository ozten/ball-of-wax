var fs = require('fs'),
    path = require('path'),
    util = require('util');

var catalog = [];

var base = path.join(__dirname, '..');
var files = fs.readdirSync(base);

files.forEach(function (f, i) {
  if (f.indexOf('volume-') == 0) {
    var json = path.join(base, f, util.format('%s.json', f));
    if (path.existsSync(json)) {
      var vol = parseInt(f.slice('volume-'.length), 10);
      catalog[vol] = JSON.parse(
        fs.readFileSync(
          json, 'utf8'));
    }
  }
});

/**
 * Format artists for Catalog view
 */
exports.artists = function (trackInfos) {
  var artists = [];
  for (var i=0; i < trackInfos.length; i += 3) {
    var a = trackInfos[i].split('-')[0].trim();
    if (! a) continue;
    if (artists.indexOf(a) == -1) {
      artists.push(a);
    }
    if (artists.length > 6) break;
  }

  return artists;
};

exports.catalog = catalog;