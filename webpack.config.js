const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = (env) => ({
  entry: {
    'app': [
      'babel-polyfill',
      './src/index.js'
    ]
  },
  output: {
    filename: 'que.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [['env', { 'modules': false }]],
          plugins: ['transform-object-rest-spread', 'transform-class-properties']
        }
      }
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader?sourceMap'
      }, {
        loader: 'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
      }]
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: env.production
    })
  ],
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    hot: true
  }
})

module.exports = config
