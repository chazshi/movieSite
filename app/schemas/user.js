var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');	//密码加密插件
var SALT_WORK_FACTOR = 10;
//骨架模版
var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,	//后面使用加盐，hash加密
	//0: normal user
	//1: verified user
	//2: professional user
	//>10: admin
	//>50: super admin
	role: {
		type: Number,
		default: 0
	},
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
UserSchema.pre('save', function(next){
	var user = this;

	if(this.isNew){
		this.meta.creatAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}

	//arg1：加密强度	//加盐，hash加密
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err) return next(err);

		bcrypt.hash(user.password, salt, null, function(err, hash){
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods = {
	comparePassword: function(_password, cb){
		bcrypt.compare(_password, this.password, function(err, isMatch){
			if(err) return cb(err);
			cb(null, isMatch);
		});
	}
}

//mongoDB数据库查询
UserSchema.statics = {
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

module.exports = UserSchema;