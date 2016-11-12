var Category = require('../models/category');

exports.new = function(req, res){
	res.render('category_admin', {
		title: 'moviesite 后台分类录入页面',
		category: {}
	});
}

// admin post movie
exports.save = function(req, res){
	var _category = req.body.category;
	
	//添加新数据
	//构造数据
	var category = new Category(_category);
	//存储数据
	category.save(function(err, movie){
		if(err){
			console.log(err);
		}
		res.redirect('/admin/category/list');	//重定向到页面
	});
	
}

//catetorylist page
exports.list = function(req, res){
	Category.fetch(function(err, categories){
		if(err){
			console.log(err);
		}
		res.render('categorylist', {
			title: 'movieSite 分类列表页',
			categories: categories
		});
	});
}

// //catetorylist delete movie
exports.del = function(req, res){
	var id = req.query.id;	//localhost/admin/list?id=xxx
	if(id){
		Category.remove({_id: id}, function(err, movie){
			if(err){
				console.log(err);
			} else {
				res.json({success:1});
			}
		});
	}
}