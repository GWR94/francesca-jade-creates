/* eslint-disable import/no-extraneous-dependencies */
const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
const common = require("./webpack.common");

require("dotenv").config();

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
            options: {
              injectType: "singletonStyleTag",
            },
          },
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin(["STRIPE_PUBLIC_KEY_TEST", "STRIPE_SECRET_KEY_TEST"]),
  ],
  devServer: {
    contentBase: path.join(__dirname, "public"),
    historyApiFallback: true,
    port: 3000,
  },
});
