var express = require('express');	//快速构建web服务器
var path = require('path');	//处理路径信息
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var _ = require('underscore');
var bodyParser = require('body-parser');	//解析客户端请求的body中的内容	
var port = process.env.PORT || 3000;
var app = express();	//启动一个web服务器

mongoose.connect('mongodb://localhost/movieSite');

app.set('views','./views/pages');	//设置视图根目录
app.set('view engine','jade');	//设置默认模版引擎
app.use(bodyParser.urlencoded({ extended: true}));	//将表单数据格式化	//app.use(express.bodyParser());	//新版express不包含bodyParser	
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
app.listen(port);

console.log('movie site started on port ' + port);

//index page
//编写路由 //访问路径：localhost:3000/
app.get('/', function(req, res){
	console.log("someone visited...");
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}
		res.render('index', {
			title: 'movieSite 首页',
			movies: movies
		});
	});
});
//伪造模版数据
// movies: [{
// 	title: '微微一笑很倾城',
// 	_id: 1,
// 	poster: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2426684961,331017121&fm=58'
// 	},
// 	{
// 		title: '终极硬汉',
// 		_id: 2,
// 		poster: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=3079651939,290462499&fm=58'
// 	},
// 	{
// 		title: '刑警兄弟',
// 		_id: 3,
// 		poster: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1714443172,3727970713&fm=58'
// 	},
// 	{
// 		title: '七月半之恐怖宿舍',
// 		_id: 4,
// 		poster: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1883621598,4150280996&fm=58'
// 	},
// 	{
// 		title: '他是龙',
// 		_id: 5,
// 		poster: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2932496934,2196901897&fm=58'
// 	},
// 	{
// 		title: '疯狂动物城',
// 		_id: 6,
// 		poster: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1888244659,1816784302&fm=58'
// 	},
// 	{
// 		title: '唐人街探案',
// 		_id: 7,
// 		poster: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2283698608,2266298747&fm=58'
// 	},
// 	{
// 		title: '我的特工爷爷',
// 		_id: 8,
// 		poster: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2837157761,1158295234&fm=58'
// 	}]


app.get('/movie/:id', function(req, res){
	var id = req.params.id;
	Movie.findById(id, function(err, movie){
		res.render('detail', {
			title: 'movieSite ' + movie.title,
			movie: movie
		});
	});
	// res.render('detail', {
	// 	title: 'movieSite 详情页',
	// 	movie: {
	// 		doctor: '赵天宇',
	// 		country: '中国内地',
	// 		title: '微微一笑很倾城',
	// 		year: 2016,
	// 		poster: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2426684961,331017121&fm=58',
	// 		language: '汉语普通话',
	// 		flash: 'http://dispatcher.video.qiyi.com/disp/shareplayer.swf?vid=93c7bf88b1025da19b6cc309070d9732&tvId=6278151009&autoPlay=1&autoChainPlay=0&showSearch=0&showSearchBox=0&showControl=1&autoHideControl=0&showRecommend=0&showFocus=0&showShare=0&showLogo=0&isLoop=0&coop=coop_baiduBaike&bd=1&showDock=0&source=&cid=qc_100001_300089',
	// 		summary: '男人对女人一见钟情的是什么，容貌、气质、身家，NO，是飞舞灵动的手指。校园王子加游戏高手肖奈同学（井柏然饰）一见钟情于美女贝微微（Angelababy饰），可钟情的并非她逼人的艳色，而是她那飞舞在键盘上的纤纤玉手和她镇定自若的气势。同是网游高手的贝微微，彼时彼刻正在电脑前有条不紊地指挥着帮战，打了一场完美的以弱胜强的辉煌战役，完全没意识到爱神小天使近在己侧。随后，篮球游泳全能优等生与游戏公司老板等身份的肖奈大神开始了网上网下全方位地捕猎美人心。于是，一场爱情，就在一朵花开的时间里，悄然萌生了。'
	// 	}
	// });
});

app.get('/admin/movie', function(req, res){
	res.render('admin', {
		title: 'movieSite 后台页面',
		movie: {
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language: ''
		}
	});
});

//admin update movie
app.get('/admin/update/:id', function(req, res){
	var id = req.params.id;
	if(id) {
		Movie.findById(id, function(err, movie){
			res.render('admin', {
				title: 'movieSite 后台更新页面',
				movie: movie
			});
		});
	}
})

// admin post movie
app.post('/admin/movie/new', function(req, res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	if(id !== 'undefined'){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err);
			}

			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie){
				if(err){
					console.log(err);
				}

				res.redirect('/movie/' + movie._id);
			});
		});
	} else {
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		});
		_movie.save(function(err, movie){
			if(err){
				console.log(err);
			}
			res.redirect('/movie/' + movie._id);
		})
	}
});

//list delete movie
app.delete('/admin/list', function(req, res){
	var id = req.query.id;
	if(id){
		Movie.remove({_id: id}, function(err, movie){
			if(err){
				console.log(err);
			} else {
				res.json({success:1});
			}

		})
	}
});

app.get('/admin/list', function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}
		res.render('list', {
			title: 'movieSite 列表页',
			movies: movies
		});
	});


	
});

//伪造模版数据
// movies: [{
// 	title: '微微一笑很倾城',
// 	_id: 1,
// 	doctor: '赵天宇',
// 	country: '中国内地',
// 	year: 2016,
// 	language: '汉语普通话',
// 	flash: 'http://dispatcher.video.qiyi.com/disp/shareplayer.swf?vid=93c7bf88b1025da19b6cc309070d9732&tvId=6278151009&autoPlay=1&autoChainPlay=0&showSearch=0&showSearchBox=0&showControl=1&autoHideControl=0&showRecommend=0&showFocus=0&showShare=0&showLogo=0&isLoop=0&coop=coop_baiduBaike&bd=1&showDock=0&source=&cid=qc_100001_300089'
// }]