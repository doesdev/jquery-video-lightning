module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON('package.json')

    meta:
      banner: "/*\n" +
        " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
        " *  <%= pkg.description %>\n" +
        " *  <%= pkg.homepage %>\n" +
        " *\n" +
        " *  Made by <%= pkg.author %>\n" +
        " *  Published under <%= pkg.licenses[0].name %> License\n" +
        " */\n"

    concat:
      dist:
        src: [ 'src/videoLightning.js' ]
        dest: 'dist/videoLightning.js'
      options: banner: '<%= meta.banner %>'

    copy: demo:
      src: 'dist/videoLightning.js'
      dest: 'demo/javascripts/videoLightning.js'

    jshint:
      files: [ 'src/videoLightning.js' ]
      options: jshintrc: '.jshintrc'

    uglify:
      my_target:
        src: [ 'src/videoLightning.js' ]
        dest: 'dist/videoLightning.min.js'
      options: banner: '<%= meta.banner %>'

    coffee:
      compile:
        files: 'src/videoLightning.js': 'src/videoLightning.coffee'

  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.registerTask 'default', ['coffee', 'jshint', 'concat', 'uglify', 'copy']
  grunt.registerTask 'travis', [ 'jshint' ]

  return
