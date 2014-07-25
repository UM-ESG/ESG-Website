'use strict';

var gulp = require('gulp');
var preprocess = require('gulp-preprocess');
var rimraf = require('gulp-rimraf');
var jshint = require('gulp-jshint');
var gutil = require('gulp-util');
var through = require('through2');
var marked = require('marked');

// Here we customize the markdown renderer to fit with the headings that the
// table of contents tool (doctoc) generates. The first id is "text" and
// subsequent ids are "text-x" and x starts at 1.
function customRenderer() {
    var renderer = new marked.Renderer();
    var headingCount = { };
    renderer.heading = function(text, level, raw) { 
        var id = raw.toLowerCase().replace(/[^\w]+/g, '-');
        var idnum = headingCount[text] || 0;
        if (idnum === 0) {
            id = id.replace(/-+$/, '');
        }

        headingCount[text] = idnum + 1;
        return '<h'
            + level
            + ' id="'
            + this.options.headerPrefix
            + id
            + (idnum === 0 ? '' : idnum) 
            + '">'
            + text
            + '</h'
            + level
            + '>\n';
    };

    return renderer;
}

// We define a custom gulp task to create a new processor on every file. This
// is inefficient, I know, but we need a new renderer on every file to keep
// track of the heading ids. Else "Section 1" in Doc A will effect the id of
// "Section 1" in Doc B.
function customMarkdownProcessor() {
    return through.obj(function(file, enc, cb) {
        marked(file.contents.toString(), { renderer: customRenderer() }, function (err, data) {
            if (err) {
                this.emit('error', new gutil.PluginError('gulp-markdown', err));
            } else {
                file.contents = new Buffer(data);
                file.path = gutil.replaceExtension(file.path, '.html');
            }

            this.push(file);
            cb();
        }.bind(this));
    });
}

gulp.task('markdown', function() {
    return gulp.src('content/*.md')
        .pipe(customMarkdownProcessor())
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

gulp.task('js', function() {
    return gulp.src('js/*')
        .pipe(jshint())
        .pipe(jshint.reporter('fail'))
        .pipe(gulp.dest('bin/js/.'));
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
    'assets',
    'js'
]);
