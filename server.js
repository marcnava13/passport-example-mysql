var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var port = process.env.PORT || 8080;
var configPassport = require('./config/passport');
var passport = require('passport');
var flash    = require('connect-flash');
var path = require('path');
var nunjucks = require('nunjucks');
var routes =  require('./app/routes/routes.js');

configPassport(passport);

nunjucks.configure(path.join(__dirname, 'app/views'), {
    autoescape: true,
    express: app,
    watch: true
}, app);

app.set('port', port);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'secretword',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

routes(app, passport);

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
