const fs = require('fs');
const browserify = require('browserify');

module.exports = (function() {
  // Create a normal bundle for debugging use
  const bundleWS = fs.createWriteStream('./dist/bundle.js');
  // Create a minimized bundle for production use
  const minBundleWS = fs.createWriteStream('./dist/bundle.min.js');

  const browserifyWithBabel = browserify('./src/main.js').transform('babelify');
  browserifyWithBabel.bundle().pipe(
    bundleWS.on('finish', function() {
      browserifyWithBabel
        .transform('uglifyify', { global: true })
        .bundle()
        .pipe(minBundleWS);
    })
  );
})();
