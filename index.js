'use strict';

module.exports = function(gulp, manifest) {

    var $$       = require('gulp-load-plugins')(),
        pipe     = require('multipipe'),
        util     = require('util'),
        Wrapper  = require('fin-hypergrid-client-module-wrapper');

    var srcDir   = './',
        buildDir = './build/',
        wrapper  = new Wrapper(manifest.name, manifest.version),
        verParts = manifest.version.split('.');

    for (var index = 1, verDirs = []; index <= verParts.length; index++) {
        verDirs.push(buildDir.replace('/', '/' + verParts.slice(0, index).join('.') + '/'));
    }

    gulp.task('lint', function() {
        return gulp.src('index.js')
            .pipe($$.eslint())
            .pipe($$.eslint.format())
            .pipe($$.eslint.failAfterError());
    });

    gulp.task('default', ['lint'], function() {
        var stream = gulp.src(srcDir + 'index.js')
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

        // output copies to each of MAJOR.MINOR.PATCH/build, MAJOR.MINOR/build, MAJOR/build
        verDirs.forEach(function(dir) {
            stream.pipe(gulp.dest(dir));
        });
    });

};
