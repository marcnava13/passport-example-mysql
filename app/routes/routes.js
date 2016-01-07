module.exports = function(app, passport) {

	app.get('/', function(req, res) {
		res.render('partials/login.html', { message: req.flash('loginMessage') }); // load the login.html file
	});

	app.get('/login', function(req, res) {
		res.render('partials/login.html', { message: req.flash('loginMessage') });
	});

	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile',
            failureRedirect : '/',
            failureFlash : true
		}),
        function(req, res) {
            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('views/profile.html', {
			user : req.user
		});
	});

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
    }));

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback',
    	passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
    }));

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}
