var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
require('dotenv').config();

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();

//postgres connection
const initOptions = {
	// global event notification;F
	error(error, e) {
		if (e.cn) {
			// A connection-related error;
			//
			// Connections are reported back with the password hashed,
			// for safe errors logging, without exposing passwords.
			console.log('CN:', e.cn);
			console.log('EVENT:', error.message || error);
		}
	}
};

const pgp = require('pg-promise')(initOptions);

const db = pgp('postgres://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME);

//test db connection during app is starting
db.connect()
	.then(obj => { // db connection testing
		obj.done();
	})
	.catch(error => {
		console.log('ERROR:', error.message || error);
	});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = {app, db};
