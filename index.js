'use strict';

module.exports = function(gulp, manifest) {

    var $$       = require('gulp-load-plugins')(),
        pipe     = require('multipipe'),
        runSeq   = require('run-sequence'),
        util     = require('util'),
        fs       = require('fs'),
        exec     = require('child_process').exec,
        path     = require('path'),
        Wrapper  = require('fin-hypergrid-client-module-wrapper');

    var buildDir = manifest.version + '/build/',
        testfile = fs.existsSync('test.js') && 'test.js' || fs.existsSync('test/index.js') && 'test/index.js',
        wrapper  = new Wrapper(manifest.name, manifest.version);

    gulp.task('lint', function() {
        return gulp.src('index.js')
            .pipe($$.eslint())
            .pipe($$.eslint.format())
            .pipe($$.eslint.failAfterError());
    });

    gulp.task('test', function(cb) {
        return gulp.src(testfile)
            .pipe($$.mocha({reporter: 'spec'}));
    });

    gulp.task('build', function() {
        return gulp.src('index.js')
            .pipe($$.header(wrapper.header))
            .pipe($$.footer(wrapper.footer))
            .pipe(
                $$.mirror(
                    pipe(
                        $$.rename(manifest.name + '.js')
                    ),
                    pipe(
                        $$.rename(manifest.name + '.min.js'),
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

    gulp.task('default', function(callback) {
        if (testfile) {
            runSeq('lint', 'test', 'build', callback);
        } else {
            runSeq('lint', 'build', callback);
        }
    });
};
