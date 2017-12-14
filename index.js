'use strict';

module.exports = function(gulp, options) {

    var $$       = require('gulp-load-plugins')(),
        pipe     = require('multipipe'),
        runSeq   = require('run-sequence'),
        util     = require('util'),
        fs       = require('fs'),
        exec     = require('child_process').exec,
        path     = require('path'),
        Wrapper  = require('fin-hypergrid-client-module-wrapper');

    options = options || {};

    var name = options.name,
        version = options.version,
        tasks = options.tasks,
        buildDir = version + '/build/',
        wrapper = new Wrapper(options);

    gulp.task('lint', function() {
        return gulp.src('index.js')
            .pipe($$.eslint())
            .pipe($$.eslint.format())
            .pipe($$.eslint.failAfterError());
    });

    gulp.task('test', function(cb) {
        var testfile = fs.existsSync('test.js') && 'test.js' ||
            fs.existsSync('test/index.js') && 'test/index.js';
        if (testfile) {
            return gulp.src(testfile)
                .pipe($$.mocha({reporter: 'spec'}));
        } else {
            return cb();
        }
    });

    gulp.task('build', function() {
        return gulp.src('index.js')
            .pipe($$.header(wrapper.header))
            .pipe($$.footer(wrapper.footer))
            .pipe(
                $$.mirror(
                    pipe(
                        $$.rename(name + '.js')
                    ),
                    pipe(
                        $$.rename(name + '.min.js'),
                        $$.uglify().on('error', util.log)
                    )
                )
            )
            .pipe(gulp.dest(buildDir));
    });

    gulp.task('doc', function(cb) {
        // caveat: this tasks assumes jsdoc.sh is installed: npm --global jsdoc
        exec(path.resolve('jsdoc.sh'), function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    });

    if (tasks) {
        tasks = Array.isArray(tasks) ? tasks : [tasks];

        gulp.task('default', function(callback) {
            runSeq.apply(null, tasks.concat(callback));
        });
    }
};
