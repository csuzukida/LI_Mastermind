const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // new
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { merge } = require('webpack-merge');

module.exports = (env, argv) => {
  const IS_DEVELOPMENT = argv.mode === 'development';

  const commonConfig = {
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
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [IS_DEVELOPMENT ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/client/index.html',
      }),
      new ForkTsCheckerWebpackPlugin(),
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss'],
    },
  };

  const prodConfig = {
    output: {
      publicPath: '/client/',
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
    ],
  };

  const devConfig = {
    devServer: {
      historyApiFallback: true,
      static: {
        directory: path.resolve(__dirname, 'dist/client'),
      },
      proxy: {
        '/api': 'http://localhost:3000',
      },
    },
    devtool: 'inline-source-map',
  };

  return merge(commonConfig, IS_DEVELOPMENT ? devConfig : prodConfig);
};
