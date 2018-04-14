const browserify = require('browserify');

module.exports = browserify('./src/compiler.js').transform('babelify', { presets: ['stage-2'] });
