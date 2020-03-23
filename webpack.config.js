/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const S3Plugin = require("webpack-s3-plugin");

module.exports = () => {
  require("dotenv").config();
  const isProduction = process.env.NODE_ENV === "production";
  return {
    entry: ["./src/index.tsx"],
    resolve: {
      extensions: [".mjs", ".ts", ".tsx", ".js", ".jsx"],
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].bundle.js",
      publicPath: "/",
    },
    node: {
      fs: "empty",
    },
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
      }),
      new Dotenv(),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        favicon: "./public/favicon.ico",
      }),
      new webpack.EnvironmentPlugin({
        "process.env.ACCESS_KEY_AWS": JSON.stringify(process.env.ACCESS_KEY_AWS),
        "process.env.SECRET_KEY_AWS": JSON.stringify(process.env.SECRET_KEY_AWS),
        "process.env.BUCKET_REGION": JSON.stringify(process.env.BUCKET_REGION),
        "process.env.BUCKET_NAME": JSON.stringify(process.env.BUCKET_NAME),
        "process.env.STRIPE_SECRET_KEY": JSON.stringify(process.env.STRIPE_SECRET_KEY),
      }),
      //   new CompressionPlugin({
      //     test: /\.(js|css)$/,
      //     filename: "[path].gz[query]",
      //     algorithm: "gzip",
      //     // deleteOriginalAssets: true,
      //   }),
      //   new S3Plugin({
      //     s3Options: {
      //       accessKeyId: process.env.ACCESS_KEY_AWS, // Your AWS access key
      //       secretAccessKey: process.env.SECRET_KEY_AWS, // Your AWS secret key
      //       region: process.env.BUCKET_REGION, // The region of your S3 bucket
      //     },
      //     s3UploadOptions: {
      //       Bucket: process.env.BUCKET_NAME, // Your bucket name
      //       ContentEncoding(fileName) {
      //         if (/\.gz/.test(fileName)) {
      //           return "gzip";
      //         }
      //       },
      //       ContentType(fileName) {
      //         if (/\.css/.test(fileName)) {
      //           return "text/css";
      //         }
      //         if (/\.js/.test(fileName)) {
      //           return "application/javascript";
      //         }
      //       },
      //     },
      //   }),
    ],
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
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: !isProduction ? "style-loader" : MiniCssExtractPlugin.loader,
              options: {
                injectType: "singletonStyleTag",
              },
            },
            "css-loader",
            "sass-loader",
          ],
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
    devtool: isProduction ? "source-map" : "inline-source-map",
    devServer: {
      contentBase: path.join(__dirname, "public"),
      historyApiFallback: true,
      port: 3000,
    },
  };
};
