var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
//const redis = require('redis');
const session = require('express-session');
//let RedisStore = require('connect-redis')(session);
//let redisClient = redis.createClient();

var dashRouter = require('./routes/dash');
var apiRouter = require('./routes/api');
var loginRouter = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
  extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

/**Session handler*/
app.use(session({
  name: 'sid',
  secret: 'ZTY1Njk3MTQ5NzlkODI5Y2JlMTc5NjNmOTkzNDQ5Yjc2N2M5OGU0M2JiODU0OGMwYzBlOWViZmZkNzgwODViOA',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, //change to true with HTTPS
    sameSite: true,
    maxAge: 600000 // Time is in miliseconds
  },
}));

/**Allow usage of a reverse proxy*/
//app.set('trust proxy', 1); //Enable if app is behind a proxy like Nginx

app.use('/', loginRouter);
app.use('/api', apiRouter);
app.use('/dash', dashRouter);

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

module.exports = app;
