'use strict';

var passport = require('passport');
var Strategy = require('passport-http').BasicStrategy;
var HashMap = require('hashmap');
//  var bcrypt = require('bcrypt');

module.exports = {
  init: init,
  ensureAuthenticated: ensureAuthenticated
};

var authorizedUsers=process.env.AUTHORIZED_USERS?process.env.AUTHORIZED_USERS.split(',') : null;
var users = new HashMap();

function init() {
  console.log('executing basic-auth.init()...');
  if (authorizedUsers) {
    passport.use(new Strategy(
     // passport.use(new LocalStrategy(
        function(username, password, cb) {
	     console.log('[INFO]: performing basic authentication...');
          if (users.has(username)) {
	        console.log('[INFO]: basic authentication, user(%s) existed...',username);
  	        var hash=users.get(username);
	        if (hash===password) {
		        console.log('Basic Auth: success, Username: %s with password  %s has same password:(%s)..', username,password, hash);
                return cb(null, username);
	        }  else {
		        console.log('Basic Auth: Failed, Username: %s with password %s do not has same hash(%s)..', username,password, hash);
                return cb(null, false); 
            }
	     }  else  {
            console.log('Basic Auth: Failed, Username: %s not available..', username);
            return cb(null, false); 
	     }
        }));
    for (var i in authorizedUsers) {
      var user=authorizedUsers[i].split(':');
      users.set(user[0],user[1]);
    }
  }   else {
    console.log('Please setup authorizedUsers environment variable...');
  }
}

function ensureAuthenticated() {
  passport.authenticate('basic', { session: false });
}


