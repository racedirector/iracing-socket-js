const path = require('path');
const webpack = require('webpack');

const appDirectory = path.resolve(__dirname, '../');

const babelLoaderConfiguration = {
  test: /\.(ts|tsx|js)?$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(appDirectory, 'index.js'),
    path.resolve(appDirectory, 'src'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: ['module:metro-react-native-babel-preset'],
      plugins: ['react-native-web'],
    },
  },
};

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
    },
  },
};

module.exports = {
  mode: 'development',
  entry: [path.resolve(appDirectory, 'index.js')],

  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, 'dist'),
  },

  module: {
    rules: [babelLoaderConfiguration, imageLoaderConfiguration],
  },

  resolve: {
    fallback: {events: require.resolve('events/')},
    alias: {
      'react-native$': 'react-native-web',
    },
    extensions: ['.web.js', '.js', '.ts', '.tsx'],
  },
};
