var fs = require('fs'),
    path = require('path'),
    util = require('util'),

    browserid = require('connect-browserid'),
    catalog = require('./catalog'),
    conf = require('../config'),
    db = require('./db'),
    stripe = require('stripe')(conf.stripe_sekrit);

var purchasedb = require('./purchases'),
    userdb = require('./userdb');

exports.home = function (req, resp) {
  console.log('home route');
  // TODO Read all volume.json files on start to populate the
  // home page volume cover thumbnails
  if (req.isXMLHttpRequest) {
    send = resp.partial.bind(resp);
  } else {
    send = resp.render.bind(resp);
  }
  send('home', {
    title: 'Ball of Wax Audio Quarterly',
    play_btn_label: 'Play Volume 25',
    vol_num: 25
  });
};

exports.volume = function (req, resp) {
  console.log('volume route');
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
  console.log('tracks route');
  var vol_num = req.params[0];
  var volume_dir = util.format('volume-%d', vol_num);
  var json_path = path.join(__dirname, '..',
                            volume_dir,
                            util.format('%s.json', volume_dir));
  fs.readFile(json_path, function (err, data) {
    console.log(json_path, data);
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
  console.log('overview route');
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

exports.can_play_volume = function (req, resp) {
  console.log('can_play route', req.params.vol);
  var data = {can_play: false, email: null},
      vol = req.params.vol;
  if (req.user) {
    data.email = req.user;
    db.withDb(function (err, conn, db) {
      if (err) {
        console.error(err);
        return resp.send(err, 500);
      }
      purchasedb.my_volumes(conn, req.user, function (err, volumes) {
        if (err) {
            console.error(err);
            return resp.send(err, 500);
        } else {
          // stream vol track
          console.log('Volumes', volumes);
          var canPlay = false;
          data.volumes = {};
          volumes.forEach(function (row, i) {
            if (row.volume_id == vol) data.can_play = true;
            data.volumes[util.format('%d', row.volume_id)] = true;
          });
            console.log(data);
          return resp.send(JSON.stringify(data), {
            'Content-Type': 'application/json'
          });
        }
      }); // purchasedb.can_play
    }); // withDb
  } else {

    resp.send(JSON.stringify(data), {
      'Content-Type': 'application/json'
    });
  }
};

exports.pay = function (req, resp) {
  if (browserid.enforceLogIn(req, resp)) {
    return;
  }
  console.log('pay as ', req.user);

  var data = {
      title: 'Buy Ball of Wax',
      payment: null,
      vol_num: req.params.volnum
  };
  db.withDb(function (err, conn, db) {
    if (err) return resp.send("Unknown Database Error", 500);
    userdb.get_or_create_user(conn, req.user, function (err, user) {
      if (err) {
          console.error(err);
          return resp.send("Unknown Database Error loading user", 500);
      }
      if (user.customer_id) {
        stripe.customers.retrieve(user.customer_id, function (err, customer) {
          data.payment = customer.active_card;
          resp.render('pay', data);
        });
      } else {
          console.log("user has a customer_id", user.customer_id);
          resp.render('pay', data);
      }
    });
  });
};

exports.add_payment_method = function (req, resp) {
  var vol_number = req.body['volume'],
      email = req.user,
      cb = function () {
        return resp.send('{}', {'Content-Type': 'application/json'});
      };

  console.log('params', req.params);
  console.log('body', req.body);

    console.log('add-payment-method running');
  if (browserid.enforceLogIn(req, resp)) return;
  console.log('calling stripe', req.body, req.user);

  db.withDb(function (err, conn, db) {
    userdb.get_or_create_user(conn, req.user, function (err, user) {
      if (err) {
        console.error(err);
        return resp.send(err, 500);
      }
      if (user.customer_id) {
        console.log('We have a customer id ', user);
        purchasedb.create_purchase(conn, email, vol_number, cb);
      } else {
      var data = { email: email, card: req.body['stripeToken'] };
      stripe.customers.create(data,
        function (err, customer) {
          console.log('customer create', err, customer);
          if (err) {
            console.log('error', err);
            //TODO this dies...
            //throw(err);
            resp.send(err, 500);
          } else {
            console.log('customer info', customer);
            purchasedb.create_stripe_customer(conn,
                                              email,
                                              customer.id);
            purchasedb.create_purchase(conn, email, vol_number, cb);
        }
      }); // customer create
      }
    });
  });
};//add_payment_method