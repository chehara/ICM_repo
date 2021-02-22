const path = require('path');
const slsw = require('serverless-webpack');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const webpack = require("webpack");

module.exports = {
  entry: slsw.lib.entries,
  plugins: [
    // To strip all locales except “en”
    new MomentLocalesPlugin(),

    // Or: To strip all locales except “en”, “es-us” and “ru”
    // (“en” is built into Moment and can’t be removed)
    new MomentLocalesPlugin({
      localesToKeep: ['es-us', 'ru'],
    }),
    new webpack.NormalModuleReplacementPlugin(/^mqtt$/, "mqtt/dist/mqtt.js")
  ],
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.ts',
      '.tsx'
    ]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  target: 'node',
  node: {
    fs: 'empty',
    tls: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader'
          }
        ],
      }
    ]
  }
};
