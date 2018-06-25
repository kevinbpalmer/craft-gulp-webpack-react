var gulp = require('gulp'),
    sass 								 = require('gulp-sass'),
    autoprefixer         = require('gulp-autoprefixer'),
    concat               = require('gulp-concat'),
    livereload           = require('gulp-livereload'),
    browserSync          = require('browser-sync').create(),
    newer                = require('gulp-newer'),
    notify               = require('gulp-notify'),
    plumber              = require('gulp-plumber'),
    rename               = require('gulp-rename'),
    size                 = require('gulp-size'),
    uglify               = require('gulp-uglify'),
    watch                = require('gulp-watch'),
    path                 = require('path'),
    cssnano              = require('gulp-cssnano'),
    sourcemaps           = require('gulp-sourcemaps'),
    fs                   = require('fs'),
		postcss 				     = require('gulp-postcss'),
		flexibility 		     = require('postcss-flexibility'),
		cached					     = require('gulp-cached'),
		jshint               = require('gulp-jshint'),
		imagemin 						 = require('gulp-imagemin'),
		webpack 						 = require('webpack'),
		gulpWebpack 				 = require('gulp-webpack'),
		webpackDevMiddleware = require('webpack-dev-middleware'),
		webpackHotMiddleware = require('webpack-hot-middleware'),
		sassPartialsImported = require('gulp-sass-partials-imported');

		var config = {
			paths: {
				input: {
					js: ['src/templates/**/*.js', '!src/templates/**/*-reactcomponent/*.js'],
					styles: ['src/templates/**/*.sass', '!src/templates/**/*-reactcomponent/*.sass'],
					images: 'src/images/**/*.{png,gif,jpg,svg}',
					reactComponents: ['src/templates/*-reactcomponent/index.{js,jsx}', '!src/templates/**/*-reactcomponent/*'],
          templates: 'src/templates/**/*',
          htmlRootFiles: ['src/**/*', 'src/**/.*', '!src/templates/**/*-reactcomponent']
				},
				output: {
					js: 'html/assets/js',
					styles: 'html/assets/styles',
					images: 'html/assets/images',
					reactComponents: 'html/assets/bundles',
          templates: 'templates',
          htmlRootFiles: 'html'
				},
			}
		}

		// browser sync
		config.browserSync = {
			files: [
				config.paths.output.reactComponents,
				config.paths.output.js,
				config.paths.output.styles
			],
			proxy: 'localhost',
			open: false
		};

		gulp.task('scripts', () => {
			var s = size();

	    return gulp.src(config.paths.input.js)
				.pipe(plumber())
				.pipe(cached('scripts'))
				.pipe(jshint())
				.pipe(jshint.reporter('jshint-stylish'))
        .pipe(gulp.dest(config.paths.output.js))
				.pipe(uglify())
				.pipe(rename({ extname: '.min.js' }))
				.pipe(gulp.dest(config.paths.output.js))
				.pipe(s)
				.pipe(notify({
					onLast: true,
					message: () => `Total minified scripts size: ${s.prettySize}`
				}));
		});

		gulp.task('styles', () => {
			var s = size();

			return gulp.src(config.paths.input.styles)
				.pipe(plumber())
				.pipe(cached('sassfiles'))
				// .pipe(sassPartialsImported(config.paths.input.styles))
				.pipe(sourcemaps.init())
				.pipe(sass({outputStyle: 'compressed'}))
				.pipe(postcss([flexibility]))
				.pipe(autoprefixer([
					"Android 2.3",
					"Android >= 4",
					"Chrome >= 20",
					"Firefox >= 24",
					"Explorer >= 8",
					"iOS >= 6",
					"Opera >= 12",
					"Safari >= 6"
				]))
				.pipe(rename({ suffix: '.min' }))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(config.paths.output.styles))
				.pipe(s)
				.pipe(notify({
					onLast: true,
					message: () => `Total minified css size: ${s.prettySize}`
				}));
		});

		gulp.task('images', () => {
			var s = size();

			return gulp.src(config.paths.input.images)
				.pipe(plumber())
				.pipe(cached('images'))
				.pipe(gulp.dest(config.paths.output.images));
		});

		gulp.task('images:build', () => {
			var s = size();

			return gulp.src(config.paths.input.images)
				.pipe(plumber())
				.pipe(cached('images'))
				.pipe(imagemin([
					imagemin.gifsicle({interlaced: true}),
					imagemin.jpegtran({progressive: true}),
					imagemin.optipng({optimizationLevel: 2})
				]))
				.pipe(gulp.dest(config.paths.output.images))
				.pipe(s)
				.pipe(notify({
					onLast: true,
					message: () => `Total minified images size: ${s.prettySize}`
				}));
		});

		gulp.task('react-components', () => {
			browserSync.reload

			return gulp.src(config.paths.input.reactComponents)
        .pipe(cached('react-components'))
				.pipe(gulpWebpack(require('./webpack.config.js'), webpack))
				.pipe(gulp.dest(config.paths.output.reactComponents));
		});

    gulp.task('templates', () => {
      return gulp.src(config.paths.input.templates)
        .pipe(cached('templates'))
        .pipe(gulp.dest(config.paths.output.templates));
    });

    gulp.task('html-root-files', () => {
      return gulp.src(config.paths.input.htmlRootFiles)
        .pipe(gulp.dest(config.paths.output.htmlRootFiles));
    });

		gulp.task('build', () => {
			gulp.start('scripts');
			gulp.start('styles');
      gulp.start('images:build');
      gulp.start('templates');
			gulp.start('html-root-files');
		});

		// watch task
		gulp.task('watch', ['build',], function() {
			browserSync.init(config.browserSync);

			// watch each individual .sass file that isn't part of a react component
			gulp.watch(config.paths.input.styles, ['styles']);

			// watch each individual .js file that isn't part of a react component
			gulp.watch(config.paths.input.js, ['scripts']);

			// watch each individual image file that is located in the src/images folder
			gulp.watch(config.paths.input.images, ['images']);

      // watch all template files and move them to the root templates folder
      gulp.watch(config.paths.input.templates, ['templates']);

      // watch all files in the root of 'src/' folder and move the files to the 'html' folder
      gulp.watch(config.paths.input.htmlRootFiles, ['html-root-files']);

			// reload browsers when any of our react components updates its bundle via Webpack
			//gulp.watch(config.paths.reactComponents).on('change', browserSync.reload);
			gulp.watch(config.paths.output.reactComponents, ['react-components']);
		});

		gulp.task('default', ['watch']);
