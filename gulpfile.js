const fs = require('fs'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  pug = require('gulp-pug'),
  argv = require('yargs').argv,
  minify = require('gulp-babel-minify'),
  replace = require('gulp-replace'),
  stylus = require('gulp-stylus'),
  concat = require('gulp-concat'),
  webserver = require('gulp-webserver'),
  webpack = require('webpack'),
  rename = require('gulp-rename'),
  webpackStream = require('webpack-stream'),
  webpackConfig = require('./webpack.config'),
  fingerprint = new Date().getTime(),
  project = JSON.parse(fs.readFileSync('./project.json', 'utf8')),
  env = argv.env || 'dev';;

function revise(){
  return replace(/@@fingerprint/g, fingerprint);
}

gulp.task('scripts:env', function() {
  const file = `${project.environments.source.root}/${env}.js`;
  return gulp.src(file)
    .pipe(minify({mangle: false}).on('error', gutil.log))
    .pipe(rename(project.environments.dist.filename))
    .pipe(gulp.dest(project.environments.dist.root));
});

gulp.task('scripts:compile', function() {
  return gulp.src(project.scripts.src.files)
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(project.scripts.dist.root));
});

gulp.task('images:copy', () => {
  return gulp.src(project.images.src.files)
    .pipe(gulp.dest(project.images.dist.root));
});

gulp.task('data:copy', () => {
  return gulp.src(project.data.src.files)
    .pipe(gulp.dest(project.data.dist.root));
});

gulp.task('styles:compile', () => {
  return gulp.src(project.styles.src.files)
    .pipe(stylus())
    .pipe(concat(project.styles.dist.filename))
    .pipe(gulp.dest(project.styles.dist.root));
});

gulp.task('templates:compile', () => {
  var files = project.templates.src.files.concat(project.templates.src.exclude);
  return gulp.src(files)
    .pipe(pug())
    .pipe(gulp.dest(project.templates.dist.root));
});

gulp.task('revise:templates', function() {
  return gulp.src(project.templates.dist.files)
    .pipe(revise())
    .pipe(gulp.dest(project.templates.dist.root));
});

gulp.task('revise:css', function() {
  return gulp.src(project.styles.dist.file)
    .pipe(revise())
    .pipe(gulp.dest(project.styles.dist.root));
});

gulp.task('serve', () => {
  return gulp.src(project.templates.dist.root)
    .pipe(webserver({
      livereload: true,
      port: 3000,
      host: '0.0.0.0'
    }));
});

gulp.task('watch', () => {
  gulp.watch(project.scripts.src.files, gulp.parallel('scripts:compile'));
  gulp.watch(project.styles.src.files, gulp.parallel('styles:compile'));
  gulp.watch(project.templates.src.files, gulp.parallel('templates:compile'));
  gulp.watch(project.images.src.files, gulp.parallel('images:copy'));
  gulp.watch(project.data.src.files, gulp.parallel('data:copy'));

});

gulp.task('build:base',
  gulp.parallel(
    'scripts:env',
    'scripts:compile',
    'images:copy',
    'data:copy',
    gulp.series(
      'styles:compile',
      'templates:compile'
    )
  )
);

gulp.task('build:revise',
  gulp.parallel(
    'revise:templates',
    'revise:css'
  )
);

gulp.task('build',
  gulp.series(
    'build:base',
    'build:revise'
  )
);

gulp.task('start',
  gulp.series(
    'build:base',
    'serve',
    'watch'
  )
);
