var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

//骨架模版
var CategorySchema = new Schema({
	name: String,
	movies: [{type: ObjectId, ref:'movies'}],

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
CategorySchema.pre('save', function(next){
	if(this.isNew){
		this.meta.creatAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}

	next();
});

//mongoDB数据库查询
CategorySchema.statics = {
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

module.exports = CategorySchema;