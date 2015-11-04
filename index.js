/*
 * configuracion:
 *[
 *  {
 *    src: path.join(base, 'src', 'templates'),
 *    dest: path.join(path.join(base, 'dist'))
 *  }
 *]
*/

var gulp = require('gulp');

var gulpif = require('gulp-if');

var jade = require('gulp-jade');

var htmlMin = require('gulp-htmlmin');

function condition(file) {
  if (file.relative.indexOf('/_') !== -1 || file.relative.indexOf('_') === 0) {
    return false;
  } else {
    return true;
  }
}

module.exports = function(configs) {
  gulp.task('templates', function() {
    configs.forEach(function(config) {
      gulp.src(config.src)
        .pipe(jade({
          locals: {
            handler: config.handler
          },
          pretty: (config.yargs.prod) ? false : true
        }))
        .pipe(gulpif(config.yargs.prod, htmlMin()))
        .pipe(gulpif(condition, gulp.dest(config.dest)));
    });
  });
};

