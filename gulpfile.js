// Include gulp
var gulp = require('gulp'),
	concat = require('gulp-concat'), // Include gulp-concat
	jade = require('gulp-jade'), // Include Jade
	uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
	browserSync = require('browser-sync'),
	flatten = require('gulp-flatten'),
	inject = require('gulp-inject'),
	useref = require('gulp-useref');

var reload = browserSync.reload;
var wiredep = require('wiredep').stream,
	mainBowerFiles = require('main-bower-files');

var allTasks = ['templates', 'scripts', 'style'];


// Convert Jade to html templates
// and include the bower files
gulp.task('templates', function(){
	return gulp.src('./src/jade/*.jade')
		.pipe(jade({
			pretty: true
		}))
		.pipe(wiredep())
		.pipe(gulp.dest('./.tmp/'))
		.pipe(reload({ stream: true }));
});

// Concatentate JS files, for faster loading
gulp.task('scripts',function(){
	return gulp.src('src/js/*.js')
		// .pipe(concat('main.js'))
		.pipe(gulp.dest('./.tmp/js'))
		.pipe(reload({ stream: true }));
});


// Copy css files to .tmp dir
gulp.task('style', function(){
	return gulp.src('src/css/*.css')
		.pipe(gulp.dest('./.tmp/css'))
		.pipe(reload({ stream: true }));
});


gulp.task('bower', function() {
	return gulp.src(mainBowerFiles({
		"overrides":{
			"bootstrap" : {
				"main": [
					// "less/bootstrap.less",
					"dist/css/*.css",
					"dist/js/*.js"
				]
			},
			'react':{
				"main":[
					"react-dom.js",
					"react-with-addons.js"
				]
			}
		}
	}), { base: 'bower_components' })
		// .pipe(flatten())
		.pipe(gulp.dest('.tmp/vendor'));
});


gulp.task('inject-fundementals', function(){

	return gulp.src(['./.tmp/index.html'])
			.pipe(inject(gulp.src(['./.tmp/vendor/jquery/*.js'], {read: false})
				, 
				// {ignorePath: '.tmp/'}
				{relative: true}
						)
			)
			.pipe( gulp.dest('./.tmp') );

});


gulp.task('inject', ['bower', 'inject-fundementals'], function(){

	return gulp.src(['./.tmp/index.html','./.tmp/result.html'])
			// .pipe(inject(gulp.src(mainBowerFiles(), {read: false}), {name: 'bower'}))
			.pipe(inject(gulp.src([ './.tmp/vendor/jquery/dist/jquery.js', './.tmp/vendor/react/react-with-addons.js', './.tmp/vendor/react/react-dom.js' ,'./.tmp/vendor/**/*.js', './.tmp/vendor/**/*.css', '!./.tmp/vendor/fullpage.js/', '!./.tmp/vendor/**/npm.js'], {read: false}), {ignorePath: '.tmp'}))
			.pipe( gulp.dest('./.tmp') );

});


// Watch for changes so we can update .tmp in realtime.
gulp.task('watch', function(){

	// livereload.listen();
	gulp.watch('src/jade/*.jade', ['templates', 'inject']);
	gulp.watch('src/js/*.js', ['scripts']);
	gulp.watch('src/css/*.css', ['style']);

});


/**
 * Starts the browsersync server.
 */
function browserSyncTask() {
	browserSync({
		server: {
			baseDir: ".tmp"
		},
		open: false
	});
}

browserSyncTask.description = "Serve the built project using BrowserSync";
gulp.task("browser-sync", ["watch"], browserSyncTask);



// Only to get contect from .tmp and output to dist
gulp.task('build', ['templates', 'scripts', 'style'], function(){

	// uglify javascript
	gulp.src(['./.tmp/js/main.js','./.tmp/js/**/*.js'])
	// gulp.src('./.tmp/')
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./build/js/'));

	// clean the css file
	gulp.src('./.tmp/css/*.css')
		.pipe(cleanCSS({debug: true}))
		.pipe(gulp.dest('./build/css/'))

});


// Default Task
gulp.task('default', ['templates','scripts', 'style', 'inject','browser-sync']);
