/* eslint-disable import/no-extraneous-dependencies */
const webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ["./src/index.tsx"],
  resolve: {
    extensions: [".mjs", ".ts", ".tsx", ".js", ".jsx"],
  },
  node: {
    fs: "empty",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.EnvironmentPlugin([
      "ACCESS_KEY_AWS",
      "SECRET_KEY_AWS",
      "BUCKET_REGION",
      "BUCKET_NAME",
      "STRIPE_PUBLIC_KEY",
      "STRIPE_SECRET_KEY",
    ]),
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
        exclude: [path.resolve(__dirname, "./node_modules")],
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg|pdf|ico|eot|woff|woff2|ttf)$/i,
        loader: "file-loader?name=[path][hash].[ext]",
      },
      {
        test: /\.(mp3|wav|mpe?g)$/,
        loader: "file-loader?name=[path][hash].[ext]",
      },
    ],
  },
};
