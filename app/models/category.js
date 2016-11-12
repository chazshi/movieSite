var mongoose = require('mongoose');
var CategorySchema = require('../schemas/category');

//模型
//mongoose表名自动变复数的，这里直接写catetories和catetory是一样的效果，都会生成catetories表
var Category = mongoose.model('categories', CategorySchema);	

module.exports = Category;