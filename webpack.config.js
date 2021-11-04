const path = require('path');

module.exports = {
  entry: './rowi-overlay.js',
  output: {
    filename: 'rowi-overlay.min.js',
    path: path.resolve(__dirname),
  },
  // optimization: { minimize: false }
};