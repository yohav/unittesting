var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var plumber = require('gulp-plumber');
var browserSyncCoverage = require('browser-sync').create();
var browserSyncTests = require('browser-sync').create();

var coverageVariable;

gulp.task('pre-test', function () {
    coverageVariable = '$$cov_' + new Date().getTime() + '$$';
    return gulp.src(['server/**/*.js'])
        // Covering files
        .pipe(istanbul({coverageVariable: coverageVariable}))
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (done) {
    return gulp.src(['test/**/*.js'], { read: false, includeUntested: true })
        .pipe(plumber())
        .pipe(mocha({reporter: 'mochawesome', reporterOptions: {reportName: 'index'}}))
        // Creating the reports after tests ran
        .pipe(istanbul.writeReports({coverageVariable: coverageVariable}));
});

gulp.task('reload-coverage', ['test'], function (done) {
    console.log("here");
    browserSyncCoverage.reload();
    browserSyncTests.reload();
    done();
});

gulp.task('watch-test', function (done) {
    gulp.watch(['server/**', 'test/**'], ['reload-coverage']);
    browserSyncCoverage.init({
        ui:{
            port: 3001
        },
        port: 3002,
        server: {
            baseDir: "./coverage/lcov-report"
        }
    });
    browserSyncTests.init({
        ui:{
            port: 3003
        },
        port: 3004,
        server: {
            baseDir: "./mochawesome-reports"
        }
    });
    done();
});

gulp.task('default', ['watch-test']);