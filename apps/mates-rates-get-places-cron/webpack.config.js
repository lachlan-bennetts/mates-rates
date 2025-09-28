const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const path = require('path');
const { join } = require('path');

const BLOCKED_VENDOR_RE = /node_modules[\\/](?:\.pnpm[\\/])?(?:chromium-bidi|socks|proxy-agent|pac-resolver|get-uri)[\\/]/i;

module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        enforce: 'pre',
        use: [
          {
            loader: require.resolve('source-map-loader'),
            options: {
              filterSourceMappingUrl: (url, resourcePath) => !BLOCKED_VENDOR_RE.test(resourcePath),
            },
          },
        ],
        exclude: [BLOCKED_VENDOR_RE],
      },
    ],
  },
  // Ignore source-map-loader issues
  ignoreWarnings: [/Failed to parse source map.*chromium-bidi/i,
    /Failed to parse source map.*cosmiconfig/i,
    /Failed to parse source map.*socks/i,
    /Failed to parse source map.*proxy-agent/i,
    /Failed to parse source map.*pac-resolver/i,
    /Failed to parse source map.*get-uri/i,
  ],
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
