import { join } from 'path';
import { APP_SRC, APP_DEST, PROJECT_ROOT } from '../config';
import { templateLocals, tsProjectFn, relativePath } from '../utils';

export = function buildJSDev(gulp, plugins) {
  let tsProject = tsProjectFn(plugins);
  return function () {
    let src = [
      join(APP_SRC, '**/*.ts'),
      '!' + join(APP_SRC, '**/*_spec.ts')
    ];

    let result = gulp.src(src)
      .pipe(plugins.plumber())
      // Won't be required for non-production build after the change
      // .pipe(plugins.inlineNg2Template({ base: APP_SRC }))
      .pipe(plugins.sourcemaps.init())
      .pipe(tsProject());

    return result.js
      .pipe(plugins.sourcemaps.write())
      .pipe(require('gulp-data')(file => {
        return require('merge')({
          currentPath: relativePath(file.path)
        }, templateLocals());
      }))
      .pipe(plugins.template())
      .pipe(gulp.dest(APP_DEST));
  };
};
