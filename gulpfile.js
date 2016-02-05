/* -----------------------
 reauire
------------------------*/
var gulp        = require('gulp');
var sass        = require('gulp-sass');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var plumber     = require('gulp-plumber');
var jshint      = require('gulp-jshint');
var imagemin    = require('gulp-imagemin');
var pngquant    = require('imagemin-pngquant');
var del         = require('del');

/* -----------------------
 path
------------------------*/
var path = {
  //develop
  src : {
    root  : 'src',
    sass  : 'src/sass/**/*.scss',
    css   : 'src/css/**/*.css',
    js    : 'src/js/**/*.js',
    jsLib : 'src/js/lib/**/*.js',
    img   : 'src/images/**/*',
    html  : 'src/**/*.html',
    all   : 'src/**/*.*'
  },
  //deploy
  dest : {
    root    : 'dest',
    cssDir  : 'dest/css',
    jsDir   : 'dest/js',
    css     : 'dest/css/**/*.css',
    html    : 'dest/',
    img     : 'dest/images',
    all     : 'dest/**/*.*'
  }
}

/* -----------------------
 Task
------------------------*/

//------------------------
// Clean
//------------------------
gulp.task('clean', function (cb) {
  return del(["dest/**/*.*", "!dest/**/.svn"], cb);
});

//------------------------
// SASS
//------------------------
gulp.task('sass', ['clean'], function () {
  return gulp.src(path.src.sass)
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(path.dest.cssDir))
    .on('end', reload);
});

//------------------------
// CSS
// いわゆるstyle.cssなどでなくbootstrapなど
//------------------------
gulp.task('css', ['clean'], function () {
  return gulp.src(path.src.css)
    .pipe(gulp.dest(path.dest.cssDir))
    .on('end', reload);
});

//------------------------
// BrowserSync
//------------------------
gulp.task('browser-sync', function() {
  return　browserSync({
    server: {
        baseDir: path.dest.root
    }
  });
});

//------------------------
// JavaScript Library
// jQueryなど
//------------------------
gulp.task('jsLib', ['clean'], function(){
  return gulp.src(path.src.jsLib)
    .pipe(gulp.dest(path.dest.jsDir))
    .on('end', reload);
});

//------------------------
// JavaScript
//------------------------
gulp.task('js', ['clean'], function(){
  return gulp.src([path.src.js, "!" + path.src.jsLib])
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(path.dest.jsDir))
    .on('end', reload);
});

//------------------------
// image compress
// 画像の圧縮
//------------------------
gulp.task('img', ['clean'], function(){
  return gulp
    .src(path.src.img)
    .pipe(imagemin({
      use: [
        pngquant({
          quality: 60-80,
          speed:   1
        })
      ]
    }))
    .pipe(gulp.dest(path.dest.img))
    .on('end', reload);
});

//------------------------
// HTML
// destフォルダへのHTMLのコピー
//------------------------
gulp.task('html', ['clean'], function(){
  return gulp
    .src(path.src.html)
    .pipe(gulp.dest(path.dest.html))
    .on('end', reload);
});

//------------------------
// Watch
// destフォルダへのHTMLのコピー
//------------------------
gulp.task('watch', ['clean'], function(){
  gulp.watch(path.src.sass, ['sass']);
  gulp.watch(path.src.css, ['css']);
  gulp.watch(path.src.html, ['html']);
  gulp.watch(path.src.jsLib, ['jsLib']);
  gulp.watch(path.src.js, ['js']);
  gulp.watch(path.src.img, ['img']);
});

/* -----------------------
 default Task
------------------------*/
gulp.task('default', ['clean','sass','css','html','jsLib','js','img']);
/* -----------------------
 watch Task
------------------------*/
gulp.task('build', ['clean','sass','css','html','jsLib','js','img','watch','browser-sync']);
