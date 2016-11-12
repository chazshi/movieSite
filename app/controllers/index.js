var Movie = require('../models/movie');
var Category = require('../models/category')

//index page
//编写路由 //访问路径：localhost:3000/
exports.index = function(req, res) {
    // if('user' in req.session) {
    // 	console.log("user in session: " + req.session.user.name);
    // } else {
    // 	console.log("user in session: " + '没有session');
    // }
    var opts = {
        path: 'movies',
        select: 'title poster',
        options: {
            limit: 6
        }
    }
    Category
        .find({})
        .populate(opts)
        .exec(function(err, categories) {
            if (err) {
                console.log(err);
            }
            res.render('index', {
                title: 'movieSite 首页',
                categories: categories
            });
        });

    // Movie.fetch(function(err, movies){
    // 	if(err){
    // 		console.log(err);
    // 	}
    // 	res.render('index', {
    // 		title: 'movieSite 首页',
    // 		movies: movies
    // 	});
    // });
}

//search page
exports.search = function(req, res) {
    var catId = req.query.cat;	//来自下面render里面的cat
    var q = req.query.q;	//来自搜索框的q
    var page = parseInt(req.query.p, 10) || 0;	//p: results.jade页面返回的，首页并不会返回page值


    var count = 2;
    var index = page * count;

    var opts = {
        path: 'movies',
        select: 'title poster'
            // options: {	//mongo的分类逻辑不是很好，自己实现分页
            // 	limit: 2,
            // 	skip: index 	//跳到索引位置查询
            // }
    }

    if (catId) {
        Category
            .find({ _id: catId })
            .populate(opts)
            .exec(function(err, categories) {
                if (err) {
                    console.log(err);
                }

                var category = categories[0] || {};
                var movies = categories[0].movies || [];

                var results = movies.slice(index, index + count);

                res.render('results', {
                    title: 'movieSite 结果列表页面',
                    keyword: category.name,
                    currentPage: (page + 1),
                    query: 'cat=' + catId,
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                });
            });
    } else {
    	Movie
    		.find({title: new RegExp(q + '.*', 'i')})	//正则，模糊匹配
    		.exec(function(err, movies){
    			if (err) {
                    console.log(err);
                }

                var results = movies.slice(index, index + count);

                res.render('results', {
                    title: 'movieSite 结果列表页面',
                    keyword: q,
                    currentPage: (page + 1),
                    query: 'q=' + q,
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                });
    		});
    }

}
