const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.ts',
  devServer: {
    port: 3000, // 端口号
    progress: true, // 显示打包编译的进度
    contentBase: './dist', // 指定当前服务处理资源的目录
    open: true // 编译完成会自动打开浏览器
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(gif|svg|jpg|png)$/,
        loader: "file-loader"
      },
      {
        test: /\.ico(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader'
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.css']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // 指定 HTML 模板文件
      filename: 'index.html', // 输出的 HTML 文件名
      minify: {
        collapseWhitespace: true, // 干掉空格
        removeComments: true, // 干掉注释
        removeAttributeQuotes: true, // 干掉双引号
        removeEmptyAttributes: true // 干掉空属性
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ],
};