const path = require('path');
const webpack = require('webpack');


const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

if (!process.env.NODE_ENV) {
  throw new Error("No NODE_ENV setting");
}
const IS_PROD = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || '3000';
const HOST = process.env.HOST || 'localhost';
const REPO_ROOT = path.resolve(__dirname, '..');
const GIT_COMMIT =
  require('child_process').execSync('git rev-parse HEAD').toString().trim();
const package = require(path.resolve(REPO_ROOT, 'package.json'));


process.traceDeprecation = true;


const entry = [path.resolve(REPO_ROOT, 'src/index.ts')];
if (!IS_PROD) {
  entry.unshift(`webpack-dev-server/client?http://${HOST}:${PORT}`);
}

module.exports = {
  mode: IS_PROD ? 'production' : 'development',
  target: 'web',
  devtool: (!IS_PROD || process.env.SOURCEMAP)
    ? 'cheap-module-source-map'
    : 'hidden-source-map',
  entry,
  output: {
    path: path.join(REPO_ROOT, 'build/dist'),
    filename: 'index.js',
    publicPath: '/',
    // Keep the source map out of the dist directory, to prevent publication.
    sourceMapFilename: IS_PROD ? '../[file].map' : '[file].map',
  },
  resolve: {
    alias: {
      // Ensure that dependencies aren't duplicated in the build.
    },
    extensions: ['.ts', '.js', '.d.ts', '.json'],
    symlinks: false,
  },
  module: {
    rules: [
      { // TypeScript.
        test: /\.(d\.)?ts$/,
        use: ['awesome-typescript-loader'],
      },
      { // HTML templates (EJS).
        test: /\.ejs$/,
        use: ['ejs-loader'],
      },
      { // CSS.
        test: /\.css$/,
        use: [
          IS_PROD ? MiniCssExtractPlugin.loader :  'style-loader',
          'css-loader',
          'resolve-url-loader',
        ],
      },
      { // Fonts.
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
      { // Ico files (favicon).
        test: /\.ico$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(!IS_PROD),
      __PROD__: JSON.stringify(IS_PROD),
      __BUILD__: JSON.stringify(process.env.NODE_ENV),
      'process.env': JSON.stringify({
        // Including this supposedly reduces the size of node modules.
        NODE_ENV: process.env.NODE_ENV,
      }),
      __APP__: JSON.stringify({
        title: package.title,
        version: package.version,
        commit: GIT_COMMIT,
      }),
    }),
    new OptimizeCssAssetsPlugin({
    }),
    new HtmlWebPackPlugin({
      title: package.title,
      template: "./src/ejs/index.ejs",
      filename: "./index.html",
      isProd: IS_PROD,
      minify: IS_PROD && {
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        quoteCharacter: '"',
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
  ],
  externals: IS_PROD ? {phaser: 'Phaser'} : {},
  stats: {
    chunks: true,
    assetsSort: 'size',
  },
};
