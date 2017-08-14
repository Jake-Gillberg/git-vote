const path = require('path');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    content: './content.js',
    insertVotes: './insertVotes.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
};
