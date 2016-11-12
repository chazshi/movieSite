var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');

//模型
//mongoose表名自动变复数的，这里直接写movies和movie是一样的效果，都会生成movies表
var User = mongoose.model('users', UserSchema);	

module.exports = User;
