const sass = require('node-sass');
var Fiber = require("fibers");
module.exports = function(grunt) {
    grunt.initConfig({
        conf: {
            js: '_static/**/*.js',
            sass: '_sass/**/*.scss',
            app: 'app',
            icons: '_static/icons',
            appIcons: 'app/icons/',
        },
        clean: {
            icons: {
                src: ["<%= conf.appIcons %>/*"]
            }
        },
        uglify: {
            dist: {
                options: {},
                files: {
                    "app/app.min.js": ['_static/**/*.js', '!_static/icons/**'],
                }
            },
        },
        sass: {
            dist: {
                options: {
                    implementation: sass,
                    fiber: Fiber,
                    sourceMap: false
                },
                files: {
                    '<%= conf.app %>/main.min.css': '_sass/main.scss',
                }
            }
        },
        cssnano: {
            options: {
                sourcemap: false,
                'postcss-zindex': false,
                'postcss-merge-idents': true,
                'postcss-discard-duplicates': true,
                'postcss-convert-values': true,
                autoprefixer: {
                    browsers: ['> 1%', 'last 2 versions', 'Firefox >= 20'],
                    add: true
                }
            },
            dist: {
                files: {
                    '<%= conf.app %>/main.min.css': '<%= conf.app %>/main.min.css'
                }
            }
        },
        watch: {
            html: {
                files: '**/*.html',
                options: {
                    livereload: true,
                },
            },
            markdown: {
                files: '**/*.md',
                options: {
                    livereload: true,
                },
            },
            scripts: {
                files: ["<%= conf.js %>"],
                tasks: ["uglify"]
            },
            sass: {
                files: ["<%= conf.sass %>"],
                tasks: ["sass"],
                options: {
                    livereload: true,
                },
            },
            js: {
                files: ["<%= conf.js %>"],
                tasks: ["uglify"],
                options: {
                    livereload: true,
                },
            },
            cssnano: {
                files: ["<%= conf.sass %>"],
                tasks: ["cssnano"]
            },
            svgmin: {
                files: ["<%= conf.iconts %>/*.svg"],
                tasks: ["svgmin:dist"]
            },
            grunticon: {
                files: ["<%= conf.icons %>/optimized/*.svg"],
                tasks: ["grunticon:myIcons", "copy"]
            }
        },
        svgmin: {
            dist: {
                options: {
                    plugins: [{
                        removeXMLProcInst: false
                    }]
                },
                files: [{
                    expand: true,
                    cwd: '<%= conf.icons %>',
                    src: ['*.svg'],
                    dest: '<%= conf.icons %>/optimized'
                }]
            }
        },
        grunticon: {
            myIcons: {
                files: [{
                    expand: true,
                    cwd: '<%= conf.icons %>/optimized',
                    src: ['*.svg'],
                    dest: '<%= conf.icons %>/final'
                }],
                options: {
                    enhanceSVG: true,
                    pngpath: '<%= conf.appIcons %>',
                    compressPNG: true
                }
            }
        },
        copy: {
            icons: {
                expand: true,
                cwd: '<%= conf.icons %>/final/png',
                src: '**',
                dest: '<%= conf.appIcons %>',
                flatten: true,
                filter: 'isFile',
            },
            style: {
                expand: true,
                cwd: '<%= conf.icons %>/final/',
                src: ['*.css'],
                dest: '<%= conf.appIcons %>',
                flatten: true,
                filter: 'isFile',
            },
            js: {
                expand: true,
                cwd: '_static/markdown/files/',
                src: '**',
                dest: 'library/docs/assets/',
                flatten: true,
                filter: 'isFile',
            },
        },
        notify_hooks: {
            options: {
                enabled: true,
                success: true
            }
        },
    });
    grunt.loadNpmTasks('grunt-cssnano');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-grunticon');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', ['watch', 'notify_hooks']);
    grunt.registerTask('icons', ['svgmin', 'grunticon', 'clean', 'copy']);
    grunt.registerTask('server', ['uglify', 'sass', 'cssnano', 'svgmin', 'grunticon', 'clean', 'copy']);
    grunt.task.run('notify_hooks');
}