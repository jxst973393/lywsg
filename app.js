'use strict';

var express = require('express');
var timeout = require('connect-timeout');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var AV = require('leanengine');
var multiparty = require('multiparty');
// var ejs = require('ejs');



// 加载云函数定义，你可以将云函数拆分到多个文件方便管理，但需要在主文件中加载它们
require('./cloud');

var app = express();

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('css', path.join(__dirname, 'css'));
app.set('js', path.join(__dirname, 'js'));
app.set('assets', path.join(__dirname, 'assets'));

// app.engine('html',ejs.__express);

// app.set('views', path.join(__dirname, 'views'));
// app.engine('html', require('ejs').__express);  
// app.set('view engine', 'html');

// app.set('view engine', 'ejs');

app.set('view engine', 'ejs');

app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

// app.set('js',path.join(__dirname,'js'));

app.use(express.static('public'));
app.use(express.static('css'));
app.use(express.static('js'));
app.use(express.static('assets'));




// app.use('/static', express.static('public'));

// app.use(express.static('js'));

// 设置默认超时时间
app.use(timeout('15s'));

// 加载云引擎中间件
app.use(AV.express());

// app.enable('trust proxy');

// 强制使用 https
app.enable('trust proxy');
// 需要重定向到 HTTPS 可去除下一行的注释。
// app.use(AV.Cloud.HttpsRedirect());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(AV.Cloud.CookieSession({ secret: 'randomString', maxAge: 3600000, fetchUser: true }));


app.get('/', function(req, res) {
  res.render('index.html', { currentTime: new Date() });
});

app.get('/ContactUs.html', function(req, res) {
  res.render('ContactUs.html', { currentTime: new Date() });
});

app.get('/zhuye.html', function(req, res) {
  res.render('zhuye.html', { currentTime: new Date() });
});


// 可以将一类的路由单独保存在一个文件中
app.use('/todos', require('./routes/todos'));
app.use('/tijiaos',require('./routes/tijiaos'));
// app.use('/index',require('./routes/index'));
app.use('/duihuan',require('./routes/duihuan'));
app.use('/menpiao',require('./routes/menpiao'));
app.use('/userlist',require('./routes/userlist'));
app.use('/userxinxi',require('./routes/userxinxi'));
app.use('/users', require('./routes/users'));
app.use('/listeditor',require('./routes/listeditor'));
app.use('/duihuaneditor',require('./routes/duihuaneditor'));
app.use('/hds',require('./routes/hd'));
app.use('/hds',require('./routes/hd'));


// app.use("/",require("./router/ccc"));

// app.use('/duihuan',require('./routes/duihuan'));
// app.use('/views', require('./routes/tijiao'));


app.use(function(req, res, next) {
  // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
  if (!res.headersSent) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
});

// error handlers
app.use(function(err, req, res, next) {
  if (req.timedout && req.headers.upgrade === 'websocket') {
    // 忽略 websocket 的超时
    return;
  }

  var statusCode = err.status || 500;
  if (statusCode === 500) {
    console.error(err.stack || err);
  }
  if (req.timedout) {
    console.error('请求超时: url=%s, timeout=%d, 请确认方法执行耗时很长，或没有正确的 response 回调。', req.originalUrl, err.timeout);
  }
  res.status(statusCode);
  // 默认不输出异常详情
  var error = {};
  if (app.get('env') === 'development') {
    // 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
    error = err;
  }
  res.render('error', {
    message: err.message,
    error: error
  });
});


module.exports = app;
