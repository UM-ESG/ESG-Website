var gulp = require('gulp');
var markdown = require('gulp-markdown');
var preprocess = require('gulp-preprocess');
var rimraf = require('gulp-rimraf');

gulp.task('markdown', function() {
    return gulp.src('content/*.md')
        .pipe(markdown())
        .pipe(gulp.dest('content/.'));
});

gulp.task('preprocess', ['markdown'], function() {
    return gulp.src('*.html')
        .pipe(preprocess())
        .pipe(gulp.dest('./bin'));
});

gulp.task('clean-markdown-temps', ['preprocess'], function() {
    return gulp.src('./content/*.html', { read: false }).pipe(rimraf());
});

gulp.task('css', function() {
    return gulp.src('css/*').pipe(gulp.dest('bin/css/.'));
});

gulp.task('images', function() {
    return gulp.src('img/*').pipe(gulp.dest('bin/img/.'));
});

gulp.task('assets', function() {
    return gulp.src(['favicon.ico']).pipe(gulp.dest('bin/.'));
});

gulp.task('default', [
    'markdown',
    'preprocess',
    'clean-markdown-temps',
    'css',
    'images',
    'assets'
]);
