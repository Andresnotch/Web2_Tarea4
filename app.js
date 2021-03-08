var path = require('path');
var logger = require('morgan');
var express = require('express');
var createError = require('http-errors');
var exphbs = require('express-handlebars')
var cookieParser = require('cookie-parser');
require('dotenv').config();
require('./config/passport');
const cookieSession = require('cookie-session');
const passport = require('passport');

var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var animalsRouter = require('./routes/animals');
var indexRouter = require('./routes/index');
var profileRouter = require('./routes/profile');
const lessMiddleware = require('less-middleware');

var app = express();

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: ['clave'] //clave para encriptar
}))
//inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.engine('handlebars', exphbs());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/animals', animalsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
