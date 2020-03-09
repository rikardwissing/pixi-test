const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: 'raw-loader',
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml|wav)$/i,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, '../'),
    }),
    new webpack.DefinePlugin({
      PROD: JSON.stringify(process.env.NODE_ENV),
    }),
    new CopyWebpackPlugin([{ from: 'src/assets/sprites', to: '' }], {
      ignore: [],
      debug: 'debug',
      copyUnmodified: true,
    }),
    new CopyWebpackPlugin([{ from: 'src/assets/fonts', to: '' }], {
      ignore: [],
      debug: 'debug',
      copyUnmodified: true,
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
};
