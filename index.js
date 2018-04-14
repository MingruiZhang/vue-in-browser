const fs = require('fs');
const browserify = require('browserify');

module.exports = browserify('./src/compiler.js')
  .transform('babelify', { presets: ['stage-2'] })
  .bundle()
  .pipe(fs.createWriteStream('./dist/bundle.js'));
