var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var _ = require('underscore');	//跟jQuery类似的一个工具集

var fs = require('fs');		//fs模块是异步的
var path = require('path');


exports.detail = function(req, res){
	var id = req.params.id;

	Movie.update({_id: id}, {$inc: {pv: 1}}, function(err) {
		if(err) {
			console.log(err);
		}
	});

	Movie.findById(id, function(err, movie){
		
		// var opts = [{
  //           path   : 'from',
  //           select : 'name'
  //       }];

		Comment
			.find({movie: id})
			.populate('from','name')	//.populate(opts)//###这里的问题是因为ref的表单名字写错了
			.populate('reply.from reply.to','name')
			.exec(function(err, comments) {

				res.render('detail', {
					title: 'moviesite ' + movie.title,
					movie: movie,
					comments: comments
				});
			});
	});
}

exports.new = function(req, res){
	Category.find({}, function(err, categories){
		res.render('admin', {
			title: 'moviesite 后台页面',
			categories: categories,
			movie: {}
		});
	});
}

//admin update movie
exports.update = function(req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function(err, movie) {
            Category.find({}, function(err, categories) {
                res.render('admin', {
                    title: 'moviesite 后台更新页面',
                    movie: movie,
                    categories: categories
                });

            });
        });
    }
}

// admin save poster
exports.savePoster = function(req, res, next) {
	var posterData = req.files.uploadPoster;
	var filePath = posterData.path;
	var originalFilename = posterData.originalFilename;

	if(originalFilename) {
		fs.readFile(filePath, function(err, data){
			var timestamp = Date.now();
			var type = posterData.type.split('/')[1];	//type: image/jpeg
			
			var poster = timestamp + '.' + type;
			var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);

			fs.writeFile(newPath, data, function(err) {
				req.poster = poster;	//传递req.poster给movieObj.poster，进而存储到数据库
				next();
			});
		});
	} else {
		next();
	}
}


// admin post movie
exports.save = function(req, res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	if(req.poster) {
		movieObj.poster = req.poster;	//传递req.poster给movieObj.poster
	}

	if(id){
		//修改数据
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err);
			}

			_movie = _.extend(movie, movieObj);	//扩展
			_movie.save(function(err, movie){
				if(err){
					console.log(err);
				}

				res.redirect('/movie/' + movie._id);
			});
		});
	} else {
		//添加新数据
		//构造数据
		_movie = new Movie(movieObj);

		var categoryId = _movie.category;
		var categoryName = movieObj.categoryName;

		//存储数据
		_movie.save(function(err, movie){
			if(err){
				console.log(err);
			}

			if(categoryId) {
				Category.findById(categoryId, function(err, category) {
					category.movies.push(movie._id);

					category.save(function(err, category) {
						res.redirect('/movie/' + movie._id);	//重定向到页面
					});
				});
				
			} else if (categoryName){
				var category = new Category({
					name: categoryName,
					movies: [movie._id]
				});

				category.save(function(err, category) {
					movie.category = category._id;
					movie.save(function(err, movie) {
						res.redirect('/movie/' + movie._id);	//重定向到页面
					});
				});
			} else {

			}

		});
	}
}

exports.list = function(req, res){
	Movie
		.find({})
		.sort('meta.updateAt')
		.populate('category', 'name')
		.exec(function(err, movies) {
			if(err){
				console.log(err);
			}
			console.log('movies: ' + movies);
			res.render('list', {
				title: 'moviesite 电影列表页',
				movies: movies
			});
		});
}

//list delete movie
exports.del = function(req, res){
	var id = req.query.id;	//localhost/admin/list?id=xxx
	if(id){
		Movie.remove({_id: id}, function(err, movie){
			if(err){
				console.log(err);
			} else {
				res.json({success:1});
			}
		});
	}
}