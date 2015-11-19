var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var envify = require('envify');
var streamify  = require('gulp-streamify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var watchify = require('watchify');
var assign = require('lodash.assign');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('serve', ['js', 'sass'], function() {
  var bundle = createBundle();
  bundle.on('update', function() { execBundle(bundle); });
  bundle.on('log', gutil.log);

  browserSync({
    server: './'
  });

  gulp.watch('./app/scss/*.scss', ['sass']);

  gulp.watch([
    './app/dist/*.js',
    './app/*.html'
  ]).on('change', browserSync.reload);

  execBundle(bundle);
});

gulp.task('release', ['js', 'sass'], function() {
  console.log('Build complete.');
});

gulp.task('js', function() {
  var bundle = createBundle();
  execBundle(bundle);
});

gulp.task('sass', function() {
  return gulp.src('./app/scss/*.scss')
    .pipe(sass())
    .on('error', gutil.log.bind(gutil, 'Sass Error'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./app/dist'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('default', ['serve']);

function createBundle() {
  var customOpts = {
    entries: ['./app/js/main.js'],
    debug: false,
    transform: [envify]
  };

  var opts = assign({}, watchify.args, customOpts);
  var bundle = watchify(browserify(opts));

  bundle.transform(babelify.configure({
    optional: ['runtime']
  }));

  return bundle;
}

function execBundle(b) {
  return b
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('all.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./app/dist'));
}
