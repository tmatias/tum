const fs = require('fs'),
  gulp = require('gulp'),
  pug = require('gulp-pug'),
  argv = require('yargs').argv,
  replace = require('gulp-replace'),
  stylus = require('gulp-stylus'),
  concat = require('gulp-concat'),
  webserver = require('gulp-webserver'),
  fingerprint = new Date().getTime(),
  project = JSON.parse(fs.readFileSync('./project.json', 'utf8'));

function revise(){
  return replace(/@@fingerprint/g, fingerprint);
}

gulp.task('images:copy', () => {
  return gulp.src(project.images.src.files)
    .pipe(gulp.dest(project.images.dist.root));
});

gulp.task('styles:compile', () => {
  return gulp.src(project.styles.src.files)
    .pipe(stylus())
    .pipe(concat(project.styles.dist.filename))
    .pipe(gulp.dest(project.styles.dist.root));
});

gulp.task('templates', () => {
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
  gulp.watch(project.styles.src.files, gulp.parallel('build'));
  gulp.watch(project.templates.src.files, gulp.parallel('build'));
  gulp.watch(project.images.src.files, gulp.parallel('build'));
});

gulp.task('build:base',
  gulp.parallel(
    'images:copy',
    gulp.series(
      'styles:compile',
      'templates'
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
    'build',
    'serve',
    'watch'
  )
);
