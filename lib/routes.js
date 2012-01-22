var fs = require('fs'),
    path = require('path'),
    util = require('util');

exports.home = function (req, resp) {
  // TODO Read all volume.json files on start to populate the
  // home page volume cover thumbnails
  resp.render('home', {
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
    console.log(json_path);
    var vol_data = JSON.parse(data);

    console.log(vol_data);
    resp.render('volume', {
      title: util.format('Ball of Wax %s', 'Summer 2005'),
      vol_num: vol_num,
      play_btn_label: 'Play Album',
      vol_data: vol_data
    });

  });
  
};