var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');

//模型
//mongoose表名自动变复数的，这里直接写movies和movie是一样的效果，都会生成movies表
var Movie = mongoose.model('movies', MovieSchema);	

module.exports = Movie;