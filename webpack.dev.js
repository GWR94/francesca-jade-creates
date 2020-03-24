/* eslint-disable import/no-extraneous-dependencies */
const webpack = require("webpack");
const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common");

require("dotenv").config();

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  plugins: [
    new webpack.EnvironmentPlugin([
      "ACCESS_KEY_AWS",
      "SECRET_KEY_AWS",
      "BUCKET_REGION",
      "BUCKET_NAME",
      "STRIPE_PUBLIC_KEY",
    ]),
  ],
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
