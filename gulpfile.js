var fs = require('fs');
var gulp = require('gulp');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var browserSync = require('browser-sync').create();
var webpack = require('webpack-stream');
var runSequence = require('run-sequence');
var nodemon = require('gulp-nodemon');
var path = require('path');
//var config = require('./config.json');


//Variables
var configFileName = 'config';
var tempFolder = './tmp';
var sourceFolder = './src';
var destFolder = './public';

//const config  = require('./config.json');
gulp.task('createConfig', function(callback) {

    let env = gutil.env.env;
    let configFile;
    switch(env) {
        case 'prod':
            configFile = './config/prod.json';
            break;
        case 'dev':
            configFile = './config/dev.json';
            break;
        default:
            configFile = './config/dev.json';
    }

    return gulp.src(configFile)
        .pipe(rename('config.json'))
        .pipe(gulp.dest('./'))
        .pipe(notify({message: env + ' config loaded.'}));

});

gulp.task('browserSync', function() {//['nodemon'], function() {
    //browserSync.init({
    //    proxy: "http://localhost:8080",
    //    files: ["public/**/*.*"],
    //    port: 8081
    //});
    browserSync.init({
        server: {
            baseDir: 'public'
        },
        port: 8081
    });
});

gulp.task('nodemon', function(cb) {
    var started = false;
    return nodemon({
        script: 'server.js'
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task('webpack', function(callback) {
    return gulp.src('./src/index.js')
        .pipe(webpack(require('./webpack.config.js') ))
        .pipe(gulp.dest('./tmp'))
        .pipe(notify({message: 'JS Transformed via Webpack.'}));
    //callback(null);
});

gulp.task('styles', function() {
    gulp.src('./sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCss({compatibility: 'ie9'}))
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.reload({ stream: true }))
        .pipe(notify({message: 'SCSS assets minified.'}));
    gulp.src('./src/css/*.css')
        .pipe(gulp.dest('public/css'))
        .pipe(notify({message: 'CSS assets ported.'}));
});

gulp.task('port-assets', function() {
    gulp.src('./src/*.html')
        .pipe(gulp.dest('public'))
        .pipe(notify({message: 'HTML assets ported.'}));
    gulp.src('./src/img/*')
        .pipe(gulp.dest('public/img'))
        .pipe(notify({message: 'Image assets ported.'}));
    gulp.src('./src/fonts/**.*')
        .pipe(gulp.dest('public/fonts'))
        .pipe(notify({message: 'Font assets ported.'}));
    gulp.src('./src/config/**.*')
        .pipe(gulp.dest('public/config'))
        .pipe(notify({message: 'Config files ported.'}));
});

gulp.task('uglify', function(callback) {
    //gulp.start('webpack');
    return gulp.src('./tmp/index.js')
        .pipe(gutil.env.env === 'prod' ? uglify() : gutil.noop())
        .pipe(gulp.dest('public'))
        .pipe(notify({message: 'Scripts ported.'}))
    //callback(null);
});

// Needed this to run synchronously.
gulp.task('javascript', function() { return runSequence('createConfig', 'webpack', 'uglify'); });

/*gulp.task('uglify', function() {
    gulp.src('./src/scripts/*.js')
        .pipe(concat('script.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('public/scripts'))
        .pipe(notify({message: 'Scripts ported.'}));
});*/

// Watch task
gulp.task('watch', ['browserSync'], function (){
    gulp.start('styles');
    gulp.watch('./sass/*.scss',['styles']);
    gulp.watch('./src/css/*.css',['styles']);
    gulp.watch('./src/*.html', ['port-assets']);
    gulp.watch('./src/img/*.*', ['port-assets']);
    gulp.watch('./src/fonts/*.*', ['port-assets']);
    gulp.watch('./src/config/*.*', ['port-assets']);
    gulp.watch('./src/**/*.js*', ['javascript']);
    gulp.watch('./config/*.json', ['javascript']);
    gulp.watch("public/*.html").on('change', browserSync.reload);
    gulp.watch("public/**/*.js*").on('change', browserSync.reload);
});

// Build task
gulp.task('default', ['styles', 'port-assets', 'javascript']);
