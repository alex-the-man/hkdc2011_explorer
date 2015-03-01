module.exports = function(grunt) {
	var WebPack = require("webpack");
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			app: {
				src: './src/index.html',
				dest: './build/index.html'
			}
		},
		webpack: {
			app: {
				entry: [ 'jsx!./src/main.jsx' ],
				output: {
					path: './build',
					filename: 'app.js',
				},
				plugins: [
					new WebPack.optimize.UglifyJsPlugin()
				],
			}
		},
		'webpack-dev-server': {
			app: {
				webpack: {
					entry: [ 'webpack/hot/dev-server', 'jsx!./src/main.jsx' ],
					output: {
						path: './build',
						filename: 'app.js',
					},
					plugins: [
						new WebPack.HotModuleReplacementPlugin()
					],
				},
				contentBase: "./build",
				hot: true,
				keepAlive: true
			}
		},
		clean: ['./build']
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-webpack');
	
	grunt.registerTask('server', ['copy', 'webpack-dev-server']);
	grunt.registerTask('build', ['copy', 'webpack']);
	grunt.registerTask('default', ['build']);
};
