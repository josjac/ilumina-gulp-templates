var gulp = require('gulp');

var path = require('path');

var fs = require('fs');

var gulpif = require('gulp-if');

var jade = require('gulp-jade');

var htmlMin = require('gulp-htmlmin');

var yargs = require('yargs').argv;

var _ = require('lodash');

var cwd = process.cwd();

var default_config = {
  src: [
    '!' + path.join(cwd, 'src', 'templates', 'client', '**'),
    '!' + path.join(cwd, 'src', 'templates', '**', '_*.jade'),
    path.join(cwd, 'src', 'templates', '**', '*.jade')
  ],
  dest: path.join(cwd, 'dist')
};

var handler = {
  env: '',
  argv: yargs,
  src_path: cwd,
  static_path: 'static/',
  getFile: getFile,
  getJSON: getJSON,
  static_url: function(path, base_path) {
    return staticURL(path, base_path || this.static_path);
  }
};

var self = {
  config: default_config,
  handler: handler,
  set: function(config) {
    this.config = _.assign(this.config, config);
  },
  run: function(config) {
    config = config || this.config;
    config.handler = _.assign(this.handler, config.handler);
    return templates(config);
  }
};

function getFile(path) {
  return fs.readFileSync(path, {
    encoding: 'utf-8'
  });
}

function getJSON(path) {
  var str = getFile(path);
  if (str) {
    return JSON.parse(str);
  }

  return {};
}

function staticURL(path, base_path) {
  if (this.env === 'jinja') {
    return "{{ handler.static_url('" + path + "') }}";
  }

  return base_path + path;
}

function templates(config) {
  return gulp.src(config.src)
  .pipe(
    jade({
      locals: {
        handler: config.handler || {}
      },
      pretty: (yargs.prod) ? false : true
    })
  )
  .pipe(gulpif(yargs.prod, htmlMin()));
}

gulp.task('templates', function() {
  self.run()
  .pipe(gulp.dest(self.config.dest));
});

module.exports = self;
