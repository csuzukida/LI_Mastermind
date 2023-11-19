const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // new
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const commonConfig = require('./webpack.common.js');

module.exports = (env, argv) => {
  const IS_DEVELOPMENT = argv.mode === 'development';

  const clientConfig = {
    devServer: {
      historyApiFallback: true,
      static: {
        directory: path.resolve(__dirname, 'dist/client'),
      },
      proxy: {
        '/api': 'http://localhost:3000',
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
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                configFile: 'tsconfig.client.json',
              },
            },
          ],
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
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: path.resolve(__dirname, 'tsconfig.client.json'),
        },
      }),
    ],
  };

  return merge(commonConfig, clientConfig);
};
