/* eslint-disable import/no-extraneous-dependencies */
const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common");

require("dotenv").config();

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: "style-loader",
            options: {
              injectType: "singletonStyleTag",
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    historyApiFallback: true,
    port: 3000,
  },
});
