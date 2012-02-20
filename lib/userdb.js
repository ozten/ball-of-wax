exports.create_user = create_user = function (conn, email, cb) {
  var ins = "INSERT INTO users (email) VALUES (?)";
  conn.query(ins, [email], function (err, db_res) {
    if (cb) cb(err, db_res);
  });
};

exports.get_user = get_user = function (conn, email, cb) {
  var sel = 
    "SELECT * FROM users "
    + "LEFT JOIN stripe_customers ON users.id = stripe_customers.user_id "
    + "WHERE email = ?";
  conn.query(sel, [email], function (err, db_res) {
    if (cb) {
      if (err) return cb(err, db_res);
      if (! db_res.length || db_res.length == 0) {
          cb(null, null);
      } else if (db_res.length != 1) 
          cb("Expected exactly one result", db_res);
      else
          cb(err, db_res[0]);
    }
  });
};

exports.get_or_create_user = function (conn, email, cb) {
  var user = get_user(conn, email, function (err, user) {
    if (err) {
      cb(err, user);
    } else if (!user) {
      create_user(conn, email, function (err, res) {
        get_user(conn, email, cb);
      });
    } else {
      cb(null, user);
    }
  });
};
