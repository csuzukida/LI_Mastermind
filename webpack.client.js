const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = (env, argv) => {
  const IS_DEVELOPMENT = argv.mode === 'development';

  const clientConfig = {
    devServer: {
      historyApiFallback: true,
      static: {
        directory: path.resolve(__dirname, 'dist/client'),
      },
      proxy: {
        '/api/**': 'http://localhost:3000',
      },
    },
    devtool: IS_DEVELOPMENT ? 'inline-source-map' : false,
    entry: './src/client/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist/client'),
      publicPath: IS_DEVELOPMENT ? '/' : '/client/',
      filename: '[name].bundle.js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          exlude: /node_modules/,
          use: [IS_DEVELOPMENT ? 'style-loader' : miniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
    plugins: [
      new htmlWebpackPlugin({
        template: 'src/client/index.html',
      }),
      new miniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
    ],
  };

  return merge(commonConfig, clientConfig);
};
