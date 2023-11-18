const commonConfig = require('./webpack.common');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { merge } = require('webpack-merge');

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
    optimization: {
      minimize: false,
    },
  };

  return merge(commonConfig, serverConfig);
};
