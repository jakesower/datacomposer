var gulp = require('gulp'),
    plugins = require("gulp-load-plugins")();



gulp.task('styles', function() {
  return gulp.src('src/styles/*.scss')
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sass({ style: 'compact', cascade: false }))
      .pipe(plugins.autoprefixer({ browsers: 'last 2 version'}))
    .pipe(plugins.sourcemaps.write('dist/assets/css'))
    .pipe(gulp.dest('dist/assets/css'))
});


gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.concat('main.js'))
    .pipe(gulp.dest('dist/assets/js'))
    // .pipe(rename({suffix: '.min'}))
    // .pipe(uglify())
    // .pipe(gulp.dest('dist/assets/js'))
});


gulp.task('watch', function() {
  plugins.livereload.listen();

  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);

  gulp.watch('dist/**').on('change', plugins.livereload.changed);
});
