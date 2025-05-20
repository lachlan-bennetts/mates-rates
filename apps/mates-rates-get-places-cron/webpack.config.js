const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const path = require('path');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
  },
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../../tsconfig.base.json'),
      }),
    ],
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    }),
  ],
};
