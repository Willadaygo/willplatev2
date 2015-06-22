'use strict';

//	VARIABLES
// --------------------

var gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	rimraf = require('rimraf'),
	browserSync = require('browser-sync'),
	browserify 	= require('browserify'),
	reload = browserSync.reload,
	source = require('vinyl-source-stream')

var dev = 'src/',
	prod = 'public/',
	paths = {
		styleGuidePages: dev + 'styleguide/**/*.twig',
		pages: dev + 'templates/**/*.twig',
		img: dev + 'img/**/*',
		css: dev +'css/*.styl',
		// js: dev + 'js/*.js',
		js: [dev + 'js/scripts.js', dev + 'js/modules/*.js'],
		vendors: dev + 'js/vendor/*.js',
		fonts: dev + 'fonts/**/*'
	};



//	TEMPLATES
// --------------------

gulp.task('templates', function () {
	return gulp.src(paths.pages)
		.pipe($.twig())
		.on("error", $.notify.onError(function (error) {
			return "Template Error: " + error.message;
		}))
		.pipe($.rename(function (path) {
			path.extname = '.html';
		}))
		.pipe(gulp.dest(prod));
});

//	Style Guide
// --------------------

gulp.task('styleguide', function () {
	return gulp.src(paths.styleGuidePages)
		.pipe($.twig())
		.on("error", $.notify.onError(function (error) {
			return "Template Error: " + error.message;
		}))
		.pipe($.rename(function (path) {
			path.extname = '.html';
		}))
		.pipe(gulp.dest(prod + 'styleguide'));
});



//	FONTS
// --------------------

gulp.task('fonts', function () {
	return gulp.src(paths.fonts)
		.pipe($.changed(prod + 'fonts'))
		.pipe(gulp.dest(prod + 'fonts'));
});

//	IMAGES
// --------------------

gulp.task('images', function () {
	return gulp.src(paths.img)
		.pipe($.changed(prod + 'img'))
		.pipe($.imagemin({
			progressive: true,
			interlaced: true,
			svgoPlugins: [{removeUselessStrokeAndFill: true}]
		}))
		.pipe(gulp.dest(prod + 'img'));
});

gulp.task('sprites', function () {
	gulp.src(dev + 'img/*.svg')
		.pipe($.svgSprites({mode: "symbols", svg: {symbols: "symbols.twig"}, preview: false}))
		.pipe(gulp.dest(dev + 'templates/partials'));
});

//	CSS
// --------------------

gulp.task('styles', function () {
	return gulp.src(dev + "css/styles.scss")
		.pipe($.plumber({errorHandler: errorAlert}))
		.pipe($.sourcemaps.init())
			.pipe($.sass())
			.pipe($.autoprefixer())
			// .pipe($.minifyCss())
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(prod + 'css'));
});

function errorAlert(error){
	$.notify.onError({title: "SCSS Error", message: "Check your terminal", sound: false})(error); //Error Notification
	console.log(error.toString());//Prints Error to Console
	this.emit("end"); //End function
};


//	CLEAN
// --------------------

gulp.task('clean', function () {
    rimraf(prod, function(er) {
		if (er) throw er
	});
});


//	JS
// --------------------

gulp.task('jshint', function () {
   return gulp.src(paths.js)
    .pipe($.jshint({
    	jquery: true
    }))
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('vendors', function(){
	return gulp.src(paths.vendors)
		.pipe($.concat('vendors.js'))
		// .pipe($.uglify())
		.pipe(gulp.dest(prod + 'js'));
});

gulp.task('scripts', function(){
	return browserify('./src/js/scripts.js')
		.bundle()
		.pipe(source("scripts.js"))
		// .pipe( $.streamify( $.uglify() ))
		.pipe(gulp.dest(prod + 'js'));
});





//	SERVER
// --------------------

gulp.task('server', function(){
	return browserSync.init([prod + '**/*'], {
		open: false,
		server: {
            baseDir: prod
        },
		notify: false
	});
});

//	WATCH
// --------------------

gulp.task('watch', function() {
	gulp.watch(dev +'css/**', ['styles']);
	gulp.watch(paths.js, ['scripts', 'jshint']).on('error', errorHandler);
	gulp.watch(paths.vendors, ['vendors']).on('error', errorHandler);
	gulp.watch(paths.img, ['images', 'sprites']).on('error', errorHandler);
	gulp.watch([
		paths.pages, 
		dev + 'templates/**/*'], 
		['templates']
	).on('error', errorHandler);
	gulp.watch([
		paths.styleGuidePages, 
		dev + 'styleguide/**/*'], 
		['styleguide']
	).on('error', errorHandler);
});

gulp.task('default', ['templates', 'styleguide', 'styles', 'scripts', 'server', 'watch']); // 'sprites', 'fonts', 'vendors',

// Handle the error
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}
