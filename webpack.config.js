const path = require('path');

module.exports = {
  entry: './src/rowi-overlay.js',
  output: {
    filename: 'rowi-overlay.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
};