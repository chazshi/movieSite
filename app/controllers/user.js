var User = require('../models/user');

//signup
exports.signup = function(req, res){
	var _user = req.body.user;	
	//req.param('user') req.param通用 
	//req.body一般是表单提交或者ajax中post的data的body里
	//	/user/signup/:userid	req.param('userid')
	//	/user/signup/111?userid=xxx		req.query('userid')
	//	
	//	/user/signup/111?userid=112	{userid: 113}	此时req.param('userid')优先级是111，113，112
	
	//检测数据库用户名是否重复
	User.findOne({name: _user.name}, function(err, user){
		if(err) {
			console.log(err);
		}
		// console.log("user: *" + user + "*");
		// console.log("username: *" + user.name + "*");
		//findOne得到的是数组//###实测这里要用if(user != '')判断，使用user.name无法判断
		if(user) {
			console.log("注册失败，注册名已被注册");
			
			return res.redirect('/signin');
		} else {
			var userObj = new User(_user);
			//userObj.role = 51;	//开放一次，注册一个超级管理员
			userObj.save(function(err, user){
				if(err) {
					console.log(err);
				}
				console.log("用户： " + user.name + "注册成功");
				res.redirect('/');
			});
		}
	});
}

//signin
exports.signin = function(req, res){
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;

	User.findOne({name: name}, function(err, user){
		if(err) {
			console.log(err);
		}
		if(!user) {
			console.log("用户： " + name + "不存在");
			return res.redirect('/signup');
		}

		user.comparePassword(password, function(err, isMatch) {
			if(err) {
				console.log(err);
			}
			if(isMatch) {
				req.session.user = user;
				console.log("用户： " + user.name + "登陆成功");

				res.redirect('/');
			} else {
				res.redirect('/signin');
				console.log("登陆失败，密码错误");
				//res.redirect('/');
			}
		})
	});

}

exports.logout = function(req, res){
	delete req.session.user;	//delete，一元操作符，用来删除一个对象的属性
	//delete app.locals.user;
	res.redirect('/');
}

//userlist page
exports.list = function(req, res){
	User.fetch(function(err, users){
		if(err){
			console.log(err);
		}
		res.render('userlist', {
			title: 'movieSite 用户列表页',
			users: users
		});
	});
}

//showSignup
exports.showSignup = function(req, res){
	res.render('signup', {
		title: 'movieSite 注册页面'
	});
}

//showSignin
exports.showSignin = function(req, res){
	res.render('signin', {
		title: 'movieSite 登陆页面'
	});
}


//midware for user
exports.signinRequired = function(req, res, next) {
    var user = req.session.user;
    if (!user) {
        return res.redirect('/signin');
    }

    next();
}


//midware for user
exports.adminRequired = function(req, res, next){
	var user = req.session.user;
	if(user.role <= 10) {
		return res.redirect('/signin');
	}

	next();
}