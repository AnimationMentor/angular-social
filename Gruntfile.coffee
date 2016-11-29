path = require 'path'

# Build configurations.
module.exports = (grunt) ->
    grunt.initConfig
        # Deletes built file and temp directories.
        clean:
            working:
                src: [
                    'angular-social.*'
                    './.temp/views'
                    './.temp/'
                ]
        copy:
            images:
                files: [
                    src: './src/images/*'
                    dest: './.temp/'
                    flatten: true
                    expand: true
                ]

        uglify:
            # concat js files before minification
            js:
                src: ['angular-social.src.js']
                dest: 'angular-social.js'
                options:
                  sourceMap: (fileName) ->
                    fileName.replace /\.js$/, '.map'
        concat:
            # concat js files before minification
            js:
                src: ['src/scripts/*.js', './.temp/views.js']
                dest: 'angular-social.src.js'

        ngTemplateCache:
            views:
                files:
                    './.temp/views.js': './src/views/**/*.html'
                options:
                    trim: './src'
                    module: 'ngSocial'

    # Register grunt tasks supplied by grunt-contrib-*.
    # Referenced in package.json.
    # https://github.com/gruntjs/grunt-contrib
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-concat'


    # Register grunt tasks supplied by grunt-hustler.
    # Referenced in package.json.
    # https://github.com/CaryLandholt/grunt-hustler
    grunt.loadNpmTasks 'grunt-hustler'

    grunt.registerTask 'dev', [
        'clean'
        'ngTemplateCache'
        'concat'
        'copy'
    ]
    grunt.registerTask 'default', [
        'dev'
        'uglify'
    ]
