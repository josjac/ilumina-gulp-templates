/*
 * configuracion:
 *[
 *  {
 *    src: ['!src/templates/client/**', 'src/templates/*.jade'],
 *    dest: 'dist'
 *  }
 *]
 */

var gulp = require('gulp');

var path = require('path');

var gulpif = require('gulp-if');

var jade = require('gulp-jade');

var htmlMin = require('gulp-htmlmin');

var yargs = require('yargs').argv;

var cwd = process.cwd();

var default_config = {
  src: [
    '!' + path.join(cwd, 'src', 'templates', 'client', '**'),
    path.join(cwd, 'src', 'templates', '*.jade')
  ],
  dest: path.join(cwd, 'dist')
};

function condition(file) {
  if (file.relative.indexOf('/_') !== -1 || file.relative.indexOf('_') === 0) {
    return false;
  } else {
    return true;
  }
}

module.exports = function(configs) {
  gulp.task('templates', function() {
    configs = configs || [default_config];

    configs.forEach(function(config) {
      config.handler = config.handler || {};

      config.yargs = yargs || {};

      gulp.src(config.src)
        .pipe(jade({
          locals: {
            handler: config.handler
          },
          pretty: (yargs.prod) ? false : true
        }))

      .pipe(gulpif(yargs.prod, htmlMin()))

      .pipe(gulpif(condition, gulp.dest(config.dest)));
    });
  });
};
