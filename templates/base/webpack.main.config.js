const path = require('path');

module.exports = {
  entry: './src/main/main.js',
  target: 'electron-main',
  mode: process.env.NODE_ENV || 'development',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};