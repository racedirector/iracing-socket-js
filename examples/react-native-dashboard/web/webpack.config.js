const path = require('path');
const webpack = require('webpack');

const appDirectory = path.resolve(__dirname, '../');

const babelLoaderConfiguration = {
  test: /\.(ts|tsx|js)?$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(appDirectory, 'index.js'),
    path.resolve(appDirectory, 'src'),
    path.resolve(appDirectory, 'node_modules', 'react-native-reanimated'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: ['module:metro-react-native-babel-preset'],
      plugins: ['react-native-web', 'react-native-reanimated/plugin'],
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
  target: 'web',
  entry: [path.resolve(appDirectory, 'index.js')],

  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, 'dist'),
  },

  plugins: [new webpack.DefinePlugin({process: {env: {}}})],

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
