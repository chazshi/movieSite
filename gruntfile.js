module.exports = function(grunt){
	grunt.initConfig({
		watch: {
			jade: {
				files: ['views/**'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
				//tasks: ['jshint'],	//语法检查
				options: {
					livereload: true
				}
			}
		},

		nodemon: {
			dev: {
				options: {
					file: 'app.js',
					args: [],
					ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
					watchedExtensions: ['js'],
					watchedFolders: ['./'],
					debug: true,
					delayTime: 1,
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				ignores: ['public/libs/**/*.js']
			},
			all: ['public/js/*.js', 'test/**/*.js', 'app/**/*.js']
		},

		less: {
			development: {
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2
				},
				files: {
					'public/build/index.css': 'public/less/index.less'
				}
			}
		},

		uglify: {
			development: {
				files: {
					'public/build/admin.min.js': 'public/js/admin.js',
					'public/build/detail.min.js': ['public/js/detail.js']
				}
			}
		},

		mochaTest: {
			options: {
				reporter: 'spec'
			},
			src : ['test/**/*.js']
		},

		concurrent: {
			tasks: [
				'nodemon', 
				'watch', 
				// 'jshint', 	//没有.jshintrc文件
				'less', 
				'uglify'
			],
			options: {
				logConcurrentOutput: true
			}
		}

	});


	grunt.loadNpmTasks('grunt-contrib-watch');	//监测文件改动，并运行注册的任务
	grunt.loadNpmTasks('grunt-nodemon');	//监测入口文件改动，自动重启app.js
	grunt.loadNpmTasks('grunt-concurrent');	//慢任务插件，并发执行多个任务，可以显著改善多个负责任务构建的耗时。
	grunt.loadNpmTasks('grunt-mocha-test');	//grunt mocha单元测试工具


	grunt.loadNpmTasks('grunt-contrib-less');//代码校验工具
	grunt.loadNpmTasks('grunt-contrib-uglify');//代码校验工具
	grunt.loadNpmTasks('grunt-contrib-jshint');//代码校验工具

	grunt.option('force', true);	//防止因为一些语法错误中断grunt
	grunt.registerTask('default', ['concurrent']);
	grunt.registerTask('test', ['mochaTest']);
}