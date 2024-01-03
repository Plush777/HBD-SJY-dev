import gulp from 'gulp';
import fileinclude from 'gulp-file-include';
import scss from 'gulp-sass';
import browserSync from 'browser-sync';
import cached from 'gulp-cached';
import autoPrefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import cleanCss from 'gulp-clean-css';

var concatSrc = {
    js: ['js/common/**/*.js', 'js/common/*.js']
}

var src = {
    html: ['*.html'],
    js: ['js/*.js', 'js/**/*.js'],
    css: ['scss/*.scss', 'scss/**/*.scss'],
    imgs: ['images/**', 'images/**/**', 'images/**/**/*']
}

var paths = {
    html: '../build/',
    js: '../build/js/',
    css: '../build/css/',
    imgs: '../build/images/'
}

var scssOptions = {
    outputStyle: "expanded",
    indentType: "tab",
    indentWidth: 1,
    precision: 6,
    sourceComments: true
};

function htmlComplie() {
    return gulp.src(src.html)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true
        }))
        .pipe(cached('html'))
        .pipe(gulp.dest(paths.html))
        .pipe(browserSync.reload({ stream: true }))
};

function scssCompile() {
    return gulp.src(src.css)
        .pipe(scss(scssOptions).on('error', scss.logError))
        .pipe(autoPrefixer())
        .pipe(concat('index.css'))
        .pipe(cleanCss())
        .pipe(cached('css'))
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.reload({ stream: true }));
};

function js() {
    return gulp.src(src.js)
        .pipe(cached('js'))
        .pipe(gulp.dest(paths.js))
        .pipe(browserSync.reload({ stream: true }));
}

function concatJs() {
    return gulp.src(concatSrc.js)
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(cached('js'))
        .pipe(gulp.dest(paths.js))
        .pipe(browserSync.reload({ stream: true }));
}

function imgs() {
    return gulp.src(src.imgs)
        .pipe(cached('imgs'))
        .pipe(gulp.dest(paths.imgs))
        .pipe(browserSync.reload({ stream: true }));
}

function watchFiles() {
    gulp.watch(src.html).on('change', htmlComplie);
    gulp.watch(src.css, scssCompile);
    gulp.watch(src.js, js);
    gulp.watch(concatSrc.js, concatJs);
    gulp.watch(src.imgs, imgs);
}

function brwSync() {
    browserSync.init({
        server: {
            baseDir: '../build/',
            index: 'index.html'
        }
    });
}

gulp.task('default', gulp.parallel(gulp.series(htmlComplie, scssCompile, js, concatJs, imgs), brwSync, watchFiles));