const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Create multiple instances
const extractCSS = new ExtractTextPlugin('public/css/[name].css');
const extractLESS = new ExtractTextPlugin('public/css/common.less');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: extractCSS.extract(['css-loader', 'style-loader'])
      }, {
        test: /\.less$/i,
        use: extractLESS.extract(['css-loader', 'less-loader'])
      }
    ]
  },
  plugins: [
    extractCSS, extractLESS
  ],
  devServer: {
    contentBase: "./public", //本地服务器所加载的页面所在的目录
    colors: true, //终端中输出结果为彩色
    historyApiFallback: true, //不跳转
    inline: true //实时刷新
  }
};
