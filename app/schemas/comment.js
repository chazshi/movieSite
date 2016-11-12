var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;	//主键
// "_id" : ObjectId("57cdc8da11f0382ed883f6f3")

//骨架模版
var CommentSchema = new Schema({
	movie: {
		type: ObjectId,
		ref: 'movies'		//注：这里ref的名字是var Movie = mongoose.model('movies', MovieSchema);	这个movies
	},
	from: {
		type: ObjectId,
		ref: 'users'
	},
	reply: [{
		from: {type: ObjectId, ref: 'users'},
		to: {type: ObjectId, ref: 'users'},
		content: String
	}],
	content: String,
	meta: {
		creatAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

///保存数据到mongoDB数据库。模式方法，save操作之前都会调用一次
CommentSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.creatAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}

	next();
});

//mongoDB数据库查询
CommentSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);
	},
	findById: function(id, cb){
		return this
			.findOne({_id: id})
			.exec(cb);
	}
}

module.exports = CommentSchema;