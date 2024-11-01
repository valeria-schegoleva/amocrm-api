
import gulp from 'gulp';
import babel from 'gulp-babel';
import cleanCSS from 'gulp-clean-css';
// import del from 'del';
import { deleteSync } from 'del';
import browserSync from 'browser-sync';
import svgSprite from 'gulp-svg-sprite';
import sourcemaps from 'gulp-sourcemaps';
import htmlmin from 'gulp-htmlmin';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import uglify from 'gulp-uglify';
import notify from 'gulp-notify';
import concat from 'gulp-concat';
import gulpif from 'gulp-if';

const { src, dest, series, watch } = gulp;
const bs = browserSync.create();

let prod = false;

const isProd = (done) => {
  prod = true;
  done();
}

const clean = (done) => {
  deleteSync(['dist/*']);
  done(); 
};

const styles = () => {
  return src('./src/styles/**/*.css')
    .pipe(gulpif(!prod, sourcemaps.init()))
    .pipe(concat('main.css'))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulpif(prod, cleanCSS({ level: 2 })))
    .pipe(gulpif(!prod, sourcemaps.write('.')))
    .pipe(dest('dist/styles'))
    .pipe(bs.stream());
};

const fonts = () => {
  return src('./src/fonts/**/*.{woff2,ttf}')
  .pipe(dest('dist/fonts'));
};

const scripts = () => {
  return src(['./src/js/**.js', './src/js/script.js'], { allowEmpty: true })
    .pipe(gulpif(!prod, sourcemaps.init()))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulpif(prod, concat('main.js')))
    .pipe(gulpif(prod, uglify({
      toplevel: true
    }).on("error", notify.onError())))
    .pipe(gulpif(!prod, sourcemaps.write()))
    .pipe(dest('dist/js'))
    .pipe(bs.stream());
}

const resources = () => src('./src/**').pipe(dest('./dist'));

const svgSprites = () => {
  return src('./src/img/**.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      },
    }))
    .pipe(dest('./app/img'))
    .pipe(bs.stream());
};

const images = async () => {
  const image = (await import('gulp-image')).default;
  return src([
    './src/img/**.jpg',
    './src/img/**.png',
    './src/img/**.jpeg',
    './src/img/*.svg',
    './src/img/**/*.jpg',
    './src/img/**/*.png',
    './src/img/**/*.jpeg'
  ])
    .pipe(image())
    .pipe(dest('./app/img'));
};


const htmlMinify = () => {
  return src('src/*.html')
    .pipe(gulpif(prod, htmlmin({ collapseWhitespace: true })))
    .pipe(dest('dist'))
    .pipe(bs.stream());
}

const watchFiles = () => {
  bs.init({
    server: {
      baseDir: "./src"
    },
  });

  gulp.watch('./src/styles/**/*.css', styles);
  gulp.watch('./src/js/**/*.js', scripts);
  gulp.watch('./src/**/*.html', htmlMinify);
  gulp.watch('./src/resources/**', resources);
  gulp.watch('./src/img/**/*.{jpg,jpeg,png,svg}', images);
  gulp.watch('./src/img/svg/**.svg', svgSprites);
};

export { styles, htmlMinify, scripts, svgSprites };
export const dev = series(clean, scripts, styles, fonts, resources, images, svgSprites, htmlMinify, watchFiles);
export const build = series(isProd, clean, scripts, fonts, styles, resources, images, svgSprites, htmlMinify);
