var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

var multipart = require('connect-multiparty');	//node文件后台上传中间件
var multipartMiddleware = multipart();

module.exports = function(app) {
	//pre handle user
	app.use(function(req, res, next){
		
		var _user;
		if(req.session.user) {
			_user = req.session.user;	//没有值赋undefined也可以的
		} else {
			_user = {
				_id: ''
			}
		}

		//var _user = req.session.user;	//没有值赋undefined也可以的
		
		// if(!_user){
		// 	_user._id = "";
		// }

		app.locals.user = _user;	//express的app.locals对象字面量	//###error:Cannot read property '_id' of undefined

		next();
	});

	//Index
	app.get('/', Index.index);	//编写路由 //访问路径：localhost:3000/

	//Movie
	app.get('/movie/:id', Movie.detail);

	app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
	app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
	app.post('/admin/movie', multipartMiddleware, User.signinRequired, User.adminRequired, Movie.savePoster, Movie.save);
	app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
	app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);

	//User
	app.post('/user/signup', User.signup);
	app.post('/user/signin', User.signin);
	app.get('/signin', User.showSignin);
	app.get('/signup', User.showSignup);
	app.get('/logout', User.logout);
	app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);

	//Common
	app.post('/user/comment', User.signinRequired, Comment.save);

	//Catetory
	app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
	app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
	app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);
	app.delete('/admin/category/list', User.signinRequired, User.adminRequired, Category.del);
	
	//results
	app.get('/results', Index.search);
	
}



//伪造模版数据
// movies: [{
// 		title: '微微一笑很倾城',
// 		_id: 1,
// 		poster: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2426684961,331017121&fm=58'
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
// 