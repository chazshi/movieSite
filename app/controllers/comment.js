var Comment = require('../models/comment');

//comment
exports.save = function(req, res){
	var _comment = req.body.comment;
	var movieId = _comment.movie;

	if(_comment.cid) {
		Comment.findById(_comment.cid, function(err, comment){

			var reply = {
				from: _comment.from,
				to: _comment.tid,
				content: _comment.content
			}

			comment.reply.push(reply);
			comment.save(function(err, comment){
				if(err){
					console.log(err);
				}
				res.redirect('/movie/' + movieId);	//重定向到页面
			});
		});
	} else {
		//添加新数据
		//构造数据
		var comment = new Comment(_comment);
		//存储数据
		comment.save(function(err, comment){
			if(err){
				console.log(err);
			}
			res.redirect('/movie/' + movieId);	//重定向到页面
		});
		
	}

}

