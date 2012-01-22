var fs = require('fs'),
    path = require('path'),
    util = require('util');

exports.home = function (req, resp) {
  // TODO Read all volume.json files on start to populate the
  // home page volume cover thumbnails
  if (req.isXMLHttpRequest) {
    send = resp.partial.bind(resp);
  } else {
    send = resp.render.bind(resp);
  }
  send('home', {
    title: 'Ball of Wax Audio Quarterly',
    play_btn_label: 'Play Volume 25'
  });
};

exports.volume = function (req, resp) {
  var vol_num = req.params[0];
  var volume_dir = util.format('volume-%d', vol_num);
  var json_path = path.join(__dirname, '..',
                            volume_dir,
                            util.format('%s.json', volume_dir));
  fs.readFile(json_path, function (err, data) {
    var vol_data = JSON.parse(data);
    if (req.isXMLHttpRequest) {
      send = resp.partial.bind(resp);
    } else {
      send = resp.render.bind(resp);
    }
    send('volume', {
      title: util.format(vol_data.title),
      vol_num: vol_num,
      play_btn_label: 'Play Album',
      vol_data: vol_data
    });

  });
};

exports.tracks = function (req, resp) {
  var vol_num = req.params[0];
  var volume_dir = util.format('volume-%d', vol_num);
  var json_path = path.join(__dirname, '..', 
                            volume_dir,
                            util.format('%s.json', volume_dir));
  fs.readFile(json_path, function (err, data) {
    var vol_data = JSON.parse(data);
if (req.isXMLHttpRequest) {
      send = resp.partial.bind(resp);
    } else {
      send = resp.render.bind(resp);
    }
    send('tracks', {
      title: util.format(vol_data.title),
      vol_num: vol_num,
      play_btn_label: 'Play Album',
      vol_data: vol_data
    });
  });
};

exports.overview = function (req, resp) {
  var vol_num = req.params[0];
  var volume_dir = util.format('volume-%d', vol_num);
  var json_path = path.join(__dirname, '..', 
                            volume_dir,
                            util.format('%s.json', volume_dir));
  fs.readFile(json_path, function (err, data) {
    var vol_data = JSON.parse(data);
    // Optional in JSON file
    if (! vol_data.edited) vol_data.edited = "Edited/compiled by Levi Fuller";
    if (! vol_data.edited) vol_data.edited = "Mastered by Levi Fuller";

    console.log("req.isXMLHttpRequest", req.isXMLHttpRequest);
    var send;
    if (req.isXMLHttpRequest) {
      send = resp.partial.bind(resp);
    } else {
      send = resp.render.bind(resp);
    }

    send('overview', {
      title: vol_data.title,
      vol_num: vol_num,
      play_btn_label: 'Play Album',
      vol_data: vol_data
    });
  });
};