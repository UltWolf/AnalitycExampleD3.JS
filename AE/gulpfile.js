var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');




gulp.task('d3', function () {
    return gulp.src('node_modules/d3/d3.js')
        .pipe(sourcemaps.init())
        .pipe(concat('d3.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('wwwroot/js'))
});
gulp.task('ajax', function () {
    return gulp.src('node_modules/ajax/lib/ajax.js')
        .pipe(sourcemaps.init())
        .pipe(concat('ajax.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('wwwroot/js'))
});

gulp.task('default', ['d3','ajax']);