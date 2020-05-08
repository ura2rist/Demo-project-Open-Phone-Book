const gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('gulp-cssnano'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat');

gulp.task('scss',() => {			//Задача SASS
	return gulp
		.src('dev/scss/**/*.scss')			//Файлы для обработки
		.pipe(sass())
		.pipe(
				autoprefixer(['last 15 version', '> 1%', 'ie 8', 'ie 7'],{
					cascade: true
				})
			)
		.pipe(cssnano())
		.pipe(gulp.dest('public/style'))
		.pipe(browserSync.reload({stream: true}));			
});

gulp.task('script',() => {
	return gulp
		.src([
			'dev/js/ajax.js',
			'dev/js/admin.js'
		])
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest('public/script'));
});

gulp.task('browser-sync', () => {
	browserSync({
		server:{
			baseDir: 'public'
		},
		notify: false
	});
});

gulp.task('default', gulp.parallel('browser-sync','scss','script'), () => {			//Дефолтная задача
	gulp.watch('dev/sass/**/*.scss', ['scss']);
});