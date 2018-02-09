var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var _ = require('underscore');
var cors = require('cors');

//db connection starts
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testpos');
//db connection ends

var index = require('./routes/index');
var users = require('./routes/users');
//var api = require('./routes/apiMethods');
var common = require('./routes/api/common');
var login = require('./routes/api/login');
var hub = require('./routes/api/hub');
var outlet = require('./routes/api/outlet');
var tax = require('./routes/api/tax');
var dishcategory = require('./routes/api/dishCategory');
var dish = require('./routes/api/dish');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', index);
app.use('/common', common);
app.use('/users', users);
app.use('/login', login);
app.use('/hub', hub);
app.use('/outlet', outlet);
app.use('/tax', tax);
app.use('/dish-category', dishcategory);
app.use('/dish', dish);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

var port = 4080;
app.listen(port, function () {
   console.log('app listening on port '+port+'!')
})

module.exports = app;
