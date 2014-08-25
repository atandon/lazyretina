module.exports = function (grunt) {
    'use strict';

    var addBanner = function (content) {
        var banner = grunt.config.get('banner');
        banner = grunt.template.process(banner);
        return banner.concat('\n', content);
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        year: (function () {
            return new Date().getFullYear();
        })(),
        banner: '/*!\n' +
                ' * lazyRetina.js v<%= pkg.version %>\n' +
                ' *\n' +
                ' * Copyright <%= year %> Ajay Tandon\n' +
                ' * Released under the MIT license\n' +
                ' */\n',

        clean: ['dist'],
        
        uglify: {
            build: {
                options: {
                    banner: '<%= banner %>'
                },
                files: {
                    'lazyretina.min.js': 'lazyretina.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['clean', 'uglify']);
};