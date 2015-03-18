var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    browserify = require('browserify'),
    stylish = require('jshint-stylish'),

    tplTransform = require('node-underscorify').transform({
      extensions: ['tpl'],
      requires: [{variable: '_', module: 'lodash'}]
    });

var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');


function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}


gulp.task('styles', function() {
  return gulp.src('src/styles/*.scss')
    // .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sass({ style: 'compact', cascade: false }))
      .pipe(plugins.autoprefixer({ browsers: 'last 2 version'}))
    // .pipe(plugins.sourcemaps.write('dist/assets/css'))
    .pipe(plugins.concat("app.css"))
    .pipe(gulp.dest('dist/assets/css'));
});



gulp.task('browserify', function() {
  var b = require('browserify')();

  return browserify('./src/scripts/app.js', {
      standalone: 'DataComposer'
    })
      .on('error', handleError)
    .transform(tplTransform)
    .bundle()
    .pipe(source('datacomposer.js')) // gives streaming vinyl file object
    .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
    .pipe(gulp.dest('./dist/assets/js'));
});



gulp.task('lint', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(plugins.jshint({
      node: true
    }))
    .pipe(plugins.jshint.reporter(stylish));
});



gulp.task('package', function() {
  return browserify('./src/scripts/app.js', {
      standalone: 'DataComposer'
    })
    // .transform(tplTransform)
    .transform(babelify)
    .bundle()
    .pipe(source('datacomposer.min.js')) // gives streaming vinyl file object
    .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
    .pipe(uglify()) // now gulp-uglify works 
    .pipe(gulp.dest('./dist/assets/js'));
});



gulp.task('watch', function() {
  plugins.livereload.listen();

  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['browserify', 'lint']);
  gulp.watch('src/scripts/templates/**/*', ['browserify']);

  gulp.watch('dist/**').on('change', plugins.livereload.changed);
});
