var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

var configAuth = require('./auth');

connection.query('USE ' + dbconfig.database);
var table_users = dbconfig.database + '`.`' + dbconfig.table.users;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM " + table_users + " WHERE id = ? ", [id], function(err, rows){
            done(err, rows[0]);
        });
    });

    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, username, password, done) {
            var password2 = req.body.password2.trim();

            connection.query("SELECT * FROM " + table_users + " WHERE email = ?", [username], function(err, rows){
                if (err)
                    return done(err);

                if (!rows.length) {
                    if(password2 === undefined || password2 === "")
                        return done(null, false, req.flash('loginMessage', 'This user not registered.'));

                    if(password.trim() !== password2)
                        return done(null, false, req.flash('loginMessage', 'Don\'t match passwords.'));

                    var newUser = {
                        email: username,
                        password: bcrypt.hashSync(password, null, null),  // use the generateHash function in our user model
                        provider: 'normal'
                    };

                    connection.query("INSERT INTO " + table_users + " set ? ", newUser, function(err, rows) {
                        newUser.id = rows.insertId;

                        return done(null, newUser);
                    });
                }else{

                    if (rows[0].password === null || !bcrypt.compareSync(password, rows[0].password)){
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong email or password.')); // create the loginMessage and save it to session as flashdata
                    }

                    return done(null, rows[0]);
                }
            });
        })
    );

    passport.use(new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL
    },

    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            connection.query("SELECT * FROM " + table_users + " WHERE provider_id = ?", [profile.id], function(err, user){

                if (err)
                    return done(err);

                if (user.length > 0) {
                    return done(null, user[0]);
                } else {
                    var newUser = {
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        provider: profile.provider,
                        provider_id: profile.id,
                        token: token,  
                    };

                    var query = connection.query("INSERT INTO " + table_users + " set ? ", newUser, function(err, rows) {
                        if (err)
                            throw err;

                        newUser.id = rows.insertId;

                        return done(null, newUser);
                    });
                }
            });

        });

    }));

    passport.use(new GoogleStrategy({
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
    },
    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            connection.query("SELECT * FROM " + table_users + " WHERE provider_id = ?", [profile.id], function(err, user){
                if (err)
                    return done(err);

                if (user.length > 0) {
                    return done(null, user[0]);
                } else {
                    var newUser = {
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        provider: profile.provider,
                        provider_id: profile.id, 
                        token: token
                    };

                    var query = connection.query("INSERT INTO " + table_users + " set ? ", newUser, function(err, rows) {
                        if (err)
                            throw err;
                        newUser.id = rows.insertId;
                        return done(null, newUser);
                    });
                }
            });

        });

    }));

};
