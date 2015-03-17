module.exports = function(grunt) {

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("video-lightning.jquery.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.licenses[0].type %> License\n" +
				" */\n"
		},

		// Concat definitions
		concat: {
			dist: {
				src: ["src/videoLightning.js"],
				dest: "dist/videoLightning.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// Copy definitions
		copy: {
			demo: {
				src: "dist/videoLightning.js",
				dest: "demo/javascripts/videoLightning.js"
			}
		},

		// Lint definitions
		jshint: {
			files: ["src/videoLightning.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
				src: ["src/videoLightning.js"],
				dest: "dist/videoLightning.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// CoffeeScript compilation
		coffee: {
			compile: {
				files: {
					"src/videoLightning.js": "src/videoLightning.coffee"
				}
			}
		}

	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-coffee");
	grunt.loadNpmTasks("grunt-contrib-copy");

	grunt.registerTask("default", ["coffee", "jshint", "concat", "uglify", "copy"]);
	grunt.registerTask("travis", ["jshint"]);

};
