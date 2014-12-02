var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    browserify = require('gulp-browserify'),
    stylish = require('jshint-stylish');


function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}


gulp.task('styles', function() {
  return gulp.src('src/styles/*.scss')
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sass({ style: 'compact', cascade: false }))
      .pipe(plugins.autoprefixer({ browsers: 'last 2 version'}))
    .pipe(plugins.sourcemaps.write('dist/assets/css'))
    .pipe(gulp.dest('dist/assets/css'))
});


gulp.task('browserify', function() {
  return gulp.src('src/scripts/app.js')
    .pipe(browserify({
      transform: ["node-underscorify"]
    }))
    .on('error', handleError)
    .pipe(gulp.dest('dist/assets/js'))
});


gulp.task('lint', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish))
});


// gulp.task('templates', function() {
//   return gulp.src('src/scripts/templates/*.hbs')
//     .pipe(plugins.handlebars())
//     .pipe(plugins.concat('templates.js'))
//     .pipe(gulp.dest('src/scripts'))     // keep in src for immediate consumption by browserify
// });


gulp.task('watch', function() {
  plugins.livereload.listen();

  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['browserify', 'lint']);
  gulp.watch('src/scripts/templates/**/*', ['browserify'])

  gulp.watch('dist/**').on('change', plugins.livereload.changed);
});
