var path = require('path');	//处理路径信息的工具
var mongoose = require('mongoose');	//mongoDB管理工具
var express = require('express');	//快速构建web服务器
var bodyParser = require('body-parser');	//解析客户端请求的body中的内容
var cookieParser = require('cookie-parser');

var session = require('express-session');
var mongoStore = require('connect-mongo')(session);	//使用mongoDB存储session信息

var logger = require('morgan');	//morgan - previously logger
// var connectMultiparty = require('connect-multiparty');	//node后台文件上传模块	//放到route.js里面去了
var fs = require('fs');

var serveStatic = require('serve-static');

var port = process.env.PORT || 3000;
var app = express();	//启动一个web服务器
var dbUrl = 'mongodb://localhost/moviesite';
// var dbUser = {
// 	user: 'root', 
// 	pass: ''
// }

// 连接字符串格式为mongodb://主机/数据库名
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);		//当录入信息时会新建一个名为moviesite的数据库

// models loading
var models_path = __dirname + '/app/models';
var walk = function(path) {
	fs
		.readdirSync(path)
		.forEach(function(file) {
			var newPath = path + '/' + file;
			var stat = fs.statSync(newPath);

			if(stat.isFile()){
				if(/(.*)\.(js|coffee)/.test(file)) {
					require(newPath);
				}
			} else if (stat.isDirectory()) {
				walk(newPath);
			}
		})
}
walk(models_path); 

app.set('views','./app/views/pages');	//设置视图根目录	//加载动态文件这样
app.set('view engine','jade');	//设置默认模版引擎

app.use(cookieParser());
//处理session	//将session存储到mongoDB数据库里（new mongoStore()）
app.use(session({
	resave: false,  //强制储存，没有修改也储存。
    saveUninitialized: true,  //强制储存没有初始化的。
	secret: 'moviesite',	//
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}));

// app.use(connectMultiparty());	//作为中间件移动到routes.js里面了，哪里调用那里声明

// 配置开发环境	// process.env：指向当前shell的环境变量
// 以前是app.configure('development,' dunction(){...})
var env = process.env.NODE_ENV || 'development';
if('development' == env) {
	app.set('showStackError', true);
	app.use(logger(':method :url :status'));	//启动调试
	app.locals.pretty = true;	//代码格式化
	mongoose.set('debug', false);	//设置true会打印所有数据库操作
}

app.use(bodyParser.urlencoded({ extended: false}));	//将表单数据格式化，编码为名值对，extended：编码为字符串还是数组	//app.use(express.bodyParser());	//新版express不包含bodyParser	
app.use(bodyParser.json())

require('./config/routes')(app);

// app.use(express.static(path.join(__dirname, 'public')));	//serve-static - previously static
app.use(serveStatic(path.join(__dirname, 'public')));

app.locals.moment = require('moment');	//时间格式化工具
app.listen(port);

console.log('movie site started on port ' + port);