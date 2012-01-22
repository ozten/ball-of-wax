exports.home = function (req, resp) {
  // TODO Read all volume.json files on start to populate the
  // home page volume cover thumbnails
  resp.render('home', {
    title: 'Ball of Wax Audio Quarterly',
    play_btn_label: 'Play Volume 25'
  });
};