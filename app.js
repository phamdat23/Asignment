var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
const methodOverride = require('method-override');
var session = require('express-session')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRoute = require('./routes/home')
var SignUpRoute = require('./routes/SignUp')
const product = require('./routes/product')
const setting = require('./routes/setting');
const apiCtr = require("./routes/api")
const category = require('./routes/category')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session({
  secret:'nhvhi3432jhdsfb4242fy2h3nksjdfh9',// chuỗi ký tự đặc biệt để Session mã hóa
  resave:true,
  saveUninitialized:true
 }));

app.use('/', homeRoute);
app.use('/users', usersRouter);
app.use('/login', indexRouter);
app.use('/signUp', SignUpRoute);
app.use('/product', product)
app.use('/setting', setting);
app.use('/category', category);
app.use('/api', apiCtr);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if(req.originalUrl.indexOf('/api')==0){
    res.json({
      status:404,
      msg: err.message
    })
  }else{
    res.status(err.status || 500);
    // res.render('error');
  }
  // render the error page
});

module.exports = app;
