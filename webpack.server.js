const path = require('path');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const commonConfig = require('./webpack.common.js');

module.exports = (env, argv) => {
  const IS_DEVELOPMENT = argv.mode === 'development';

  const serverConfig = {
    target: 'node',
    devtool: IS_DEVELOPMENT ? 'inline-source-map' : false,
    entry: './src/server/server.ts',
    output: {
      path: path.resolve(__dirname, 'dist/server'),
      filename: 'server.js',
      clean: true,
    },
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                configFile: 'tsconfig.server.json',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: path.resolve(__dirname, 'tsconfig.server.json'),
        },
      }),
    ],
    optimization: {
      minimize: false,
    },
  };

  return merge(commonConfig, serverConfig);
};
