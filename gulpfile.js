(function(){
  "use strict";

  /* globals require, process */

  var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    ngAnnotate = require('gulp-ng-annotate'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    runSequence = require('run-sequence'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    minifyCSS = require('gulp-minify-css'),
    prefix = require('gulp-autoprefixer'),
    karma = require('gulp-karma'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush')
    ;

  /********* ENVIRONMENT SETUP *****************/
  var env = process.env.NODE_ENV || 'development' ;
  var isDevelopment = (env === 'development');
  var isProduction = (env === 'production');

  /********* Bower Libs (TODO create a task to automate this) *****************/
  var bowerLibs = [
    'bower_components/angular/angular.js',
    'bower_components/angular-route/angular-route.js'
  ];
  var bowerStyleLibs = [
    'bower_components/bootstrap/dist/css/bootstrap.css'
  ];

  if(isProduction){
    bowerLibs = [
      'bower_components/angular/angular.min.js',
      'bower_components/angular-route/angular-route.min.js'
    ];

    bowerStyleLibs = [
      'bower_components/bootstrap/dist/css/bootstrap.min.css'
    ];
  }

  /********* DIRECTORIES SOURCE AND BUILD *****************/
  var srcDir = 'src';
  var src = {
    angularFiles: srcDir + '/angular/**/*.js',
    specFiles: srcDir + '/angular/**/*.spec.js',
    sassFiles: srcDir + '/sass/**/*.sass',
    htmlFiles: srcDir + '/angular/**/*.html',
    mainSassFile: srcDir + '/sass/apps.sass'
  };

  var assetDir = 'assets';
  var assets = {
    jsonFiles: assetDir + '/json/**/*.json',
    imageFiles: [assetDir + '/img/**/*.png', assetDir + '/img/**/*.jpg', assetDir + '/img/**/*.gif']
  };

  var outputDir = 'builds/development';
  if(isProduction){
    outputDir = 'builds/production';
  }

  var output = {
    dir: {
      html: outputDir,
      css: outputDir + '/css',
      js: outputDir + '/js',
      assetsImg: outputDir + '/assets/img',
      assetsJson: outputDir + '/assets/json'
    },
    file: {
      vendorjs: 'vendor.js',
      vendorcss: 'vendor.css',
      angularjs: 'angular-app.js',
      karmaTestJs: 'angular-app.spec.js',
      css: 'apps.css',
      htmlIndex: 'index.html'
    }
  };

  /********* CONFIGURATIONS *****************/
  var serverPort = 8000;
  var livereloadPort = 35777;

  /********* UTIL FUNCTIONS FOR THIS GULPFILE.js *****************/
  function logError(error) {
    gutil.log(gutil.colors.red(error.message));
    gutil.beep();
    this.emit('end');
  }

  /*################### TASKS #################################*/

  gulp.task('clean', function(){
    return gulp.src([outputDir])
      .pipe(clean({force: true, read: false}));
  });

  gulp.task('html' , function() {
    return gulp.src(src.htmlFiles)
      .pipe(plumber(logError))
      .pipe(gulp.dest(output.dir.html))
      .pipe(connect.reload());
  });

  gulp.task('lint', function () {
    gulp.src(src.angularFiles)
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
  });

  gulp.task('js', function () {
    return gulp
      .src(src.angularFiles)
      .pipe(plumber(logError))
    .pipe(ngAnnotate({remove: true,add: true,single_quotes: true}))
      //.pipe(gulpif(isProduction , uglify()))
      .pipe(concat(output.file.angularjs))
      .pipe(gulp.dest(output.dir.js))
      .pipe(connect.reload());
  });

  gulp.task('specs', function () {
    return gulp
      .src(src.specFiles)
      .pipe(plumber(logError))
      .pipe(concat(output.file.karmaTestJs))
      .pipe(gulp.dest(output.dir.js));
  });

  gulp.task('sass', function(){
    var config = {};

    if(isProduction){
      config.outputStyle = 'compressed';
    }

    return gulp.src(src.mainSassFile)
      .pipe(plumber(logError))
      .pipe(sass(config))
      .pipe(prefix(["last 2 version", "> 1%", "ie 8"], { cascade: true }))
      .pipe(gulp.dest(output.dir.css))
      .pipe(connect.reload());

  });

  gulp.task('assets-json' , function() {
    return gulp.src(assets.jsonFiles)
      .pipe(plumber(logError))
      .pipe(gulp.dest(output.dir.assetsJson))
      .pipe(connect.reload());
  });

  gulp.task('assets-image' , function() {
    return gulp.src(assets.imageFiles)
      .pipe(plumber(logError))
      .pipe(gulpif(isProduction , imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngcrush()]
      })))
      .pipe(gulp.dest(output.dir.assetsImg))
      .pipe(connect.reload());
  });

  gulp.task('bower', function(){
    return gulp.src(bowerLibs)
      .pipe(plumber(logError))
      .pipe(concat(output.file.vendorjs))
      .pipe(gulp.dest(output.dir.js))
      .pipe(connect.reload());
  });

  gulp.task('bower-styles', function(){
    return gulp.src(bowerStyleLibs)
      .pipe(plumber(logError))
      .pipe(concat(output.file.vendorcss))
      .pipe(gulp.dest(output.dir.css))
      .pipe(connect.reload());
  });

  gulp.task('watch', function(){
    gulp.watch(src.angularFiles, ['js']);
    gulp.watch(src.sassFiles, ['sass']);
    gulp.watch(src.mainSassFile, ['sass']);
    gulp.watch(src.htmlFiles,  ['html'] );
    gulp.watch(src.specFiles,  ['specs'] );
    gulp.watch(assets.jsonFiles,  ['assets-json'] );
    gulp.watch(assets.imageFiles,  ['assets-image'] );
    gulp.watch(bowerLibs,  ['bower'] );
  });

  gulp.task('connect', function() {
    connect.server({
      root: [outputDir],
      port: serverPort,
      fallback: output.dir.html + '/' +output.file.htmlIndex,
      livereload : { port: livereloadPort }
    });
  });

  gulp.task('build', function(callback) {
    gutil.log(gutil.colors.green('Building for <<'+ env.toUpperCase() + '>> environment'));
    runSequence('clean',
      ['html', 'lint', 'js' ,'sass', 'bower','bower-styles', 'assets-json', 'assets-image', 'specs'],
      callback);
  });

  gulp.task('default', function(callback) {
    runSequence('build',
                'watch',
                'connect',
                callback);
  });

  // Karma
  gulp.task('karma', function () {
    return gulp.src(['no need to supply files because everything is in config file'])
      .pipe(karma({
        configFile: 'karma.conf.js',
        action: 'watch'
      }).on('error', logError));
  });


  // The protractor task
  var protractor = require('gulp-protractor').protractor;

  // Download and update the selenium driver
  var webdriver_update = require('gulp-protractor').webdriver_update;

  // Downloads the selenium webdriver
  gulp.task('webdriver_update', webdriver_update);

  // Setting up the test task
  gulp.task('e2e', function(cb) {
    gulp.src(['./src/test-e2e/*.js']).pipe(protractor({
      configFile: './src/test-e2e/protractor.config.js'
    })).on('error', function(e) {
      console.log(e);
    }).on('end', cb);
  });

})();
