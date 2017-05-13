var gulp = require('gulp'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync'),
    nodeTimeout = 1000;


var reload = browserSync.reload;    


gulp.task('sass', function () {
    return gulp.src('public/assets/css/main_style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('public/assets/css/'))
        // .pipe(browserSync.reload({stream:true}));       
});



gulp.task('browser-sync', function() {
    browserSync({
        proxy: '127.0.0.1:3000',
        port: 3000,
        open: true, 
        notify: false
    });
});


gulp.task('watch', function(){

  gulp.watch('public/assets/css/**/*.scss', { interval: nodeTimeout }, ['sass']); //all .scss in sass folder  

  /*gulp.watch('public/assets/css/*.scss', { interval: nodeTimeout }, ['sass'])
  .on('change', function () {
    browserSync.reload();
  }); //all .scss in sass folder */


}); 



//calling it 'default' will run by just typing gulp
gulp.task('default', [
  'sass',
  // 'browser-sync',
  'watch'
]);
