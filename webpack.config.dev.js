const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');
const path = require("path");

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: { 
    contentBase: path.join(__dirname, "dist"), 
    compress: true,
    stats: 'minimal',
  },
});
