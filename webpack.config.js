const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const HappyPack = require('happypack')
const os = require('os')
const happyPackThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: './src/main.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: './'
  },
  resolve: {
    extensions: ['.js', '.tsx', 'ts'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      pages: path.resolve(__dirname, 'src/pages'),
      router: path.resolve(__dirname, 'src/router')
    }
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts|js)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'happypack/loader?id=busongBabel'
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              compilerOptions: {
                module: 'es2015',
                lib: ['es6', 'es7', 'dom']
              }
            }
          }
        ]
      },
      {
        test: /\.(less|css)?$/,
        use: [
          // MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)/,
        use: {
          loader: 'url-loader',
          options: {
            outputPath: 'images/', // 图片输出的路径
            limit: 10 * 1024
          }
        }
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
              publicPath: 'fonts/',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // new MiniCssExtractPlugin({
    //   filename: "[name][hash:8].css",
    //   chunkFilename: "[name][hash:8].css"
    // }),
    new webpack.DefinePlugin({
      'process.env': {
        VUEP_BASE_URL: JSON.stringify('http://localhost:9000')
      }
    }),
    new HappyPack({
      id: 'busongBabel',
      loaders: ['babel-loader?cacheDirectory'],
      threadPool: happyPackThreadPool
    })
  ],
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, '/dist'),
    host: '0.0.0.0',
    port: 3012,
    historyApiFallback: true,
    inline: true,
    publicPath: '/'
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all' // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件
    }
  }
}
