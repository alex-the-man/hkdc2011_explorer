var WebPack = require("webpack");
var entryJsPath = "jsx!./src/main.jsx";
var buildDirPath = "./build";
var bundledJsName = "app.js"

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		webpack: {
			app: {
				entry: [ entryJsPath ],
				output: {
					path: buildDirPath,
					filename: bundledJsName,
				},
				plugins: [
					new WebPack.optimize.UglifyJsPlugin()
				],
			}
		},
		"webpack-dev-server": {
			app: {
				webpack: {
					entry: [ "webpack/hot/dev-server", entryJsPath ],
					output: {
						path: buildDirPath,
						filename: bundledJsName,
					},
					plugins: [
						new WebPack.HotModuleReplacementPlugin()
					],
					devtool: "eval",
				},
				hot: true,
				keepAlive: true,
			}
		},
		clean: [ bundledJsName ]
	});

	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-webpack");
	
	grunt.registerTask("server", ["webpack-dev-server"]);
	grunt.registerTask("build", ["webpack"]);
	grunt.registerTask("default", ["build"]);
};
