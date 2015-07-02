'use strict';

var gulp = require('gulp');
var preprocess = require('gulp-preprocess');
var rimraf = require('gulp-rimraf');
var jshint = require('gulp-jshint');
var gutil = require('gulp-util');
var prefix = require('gulp-autoprefixer');
var through = require('through2');
var marked = require('marked');
var _ = require('underscore');
var _s = require('underscore.string');
var path = require('path');
var fs = require('fs');
var Promise = require('bluebird');
var glob = Promise.promisify(require('glob-all'));
var pp = Promise.promisify(require('preprocess').preprocessFile);
Promise.promisifyAll(fs);

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

// Renders all the files that are in markdown and don't have a specific format
// specified into a generic, but nice looking document
gulp.task('content-markdown', ['markdown'], function(cb) {
    // Find all the files that have been rendered into html from markdown and
    // don't have an associated html file in the base directory
    var files = glob(["content/*.md", "*.html"]);

    Promise.join(files, 
        fs.readFileAsync(path.join("includes", "content.html"), 
            { encoding: 'utf8' }),
        function(paths, template) {
            var htmls = paths.filter(function(val) {
                return path.extname(val) === '.html';
            }).map(function(val) {
                return path.basename(val, ".html");
            });

            var mds = paths.filter(function(val) {
                return path.extname(val) === '.md';
            }).map(function(val) {
                return path.basename(val, ".md");
            });

            paths = _.difference(mds, htmls).map(function(val) {
                return path.join("content", val + ".html");
            });

            // Create an individualized template for each of the markdown files
            return paths.map(function(val) {
                var templatePath = path.basename(val);
                var newContents = template.replace("##REPLACE##", val);
                return fs.writeFileAsync(templatePath, newContents).return(templatePath);
            });
        }).map(function(val) {
            // Instantiate the template and remove the temporary template
            // afterwards
            var binPath = path.join("bin", val);
            var title = _s.capitalize(_s.humanize(path.basename(val, ".html")));
            return pp(val, binPath, {TITLE: title}).return(val);
        }).each(fs.unlink).all().then(function() { cb(); });
});

gulp.task('preprocess', ['markdown', 'content-markdown'], function() {
    return gulp.src('*.html')
        .pipe(preprocess())
        .pipe(gulp.dest('./bin'));
});

gulp.task('clean-markdown-temps', ['preprocess'], function() {
    return gulp.src('./content/*.html', { read: false }).pipe(rimraf());
});

gulp.task('css', function() {
    return gulp.src('css/*')
        .pipe(prefix('last 2 version', '> 1%'))
        .pipe(gulp.dest('bin/css/.'));
});

gulp.task('js', function() {
    return gulp.src('js/*')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
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
