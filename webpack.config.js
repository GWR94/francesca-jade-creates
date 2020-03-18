const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = () => {
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
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
      }),
      new webpack.HashedModuleIdsPlugin(),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        favicon: "./public/favicon.ico",
      }),
      new Dotenv(),
    ],
    optimization: {
      moduleIds: "hashed",
      minimizer: [
        new TerserPlugin({
          extractComments: true,
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
              )[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace("@", "")}`;
            },
          },
        },
      },
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
          test: /\.(jpg|jpeg|png|gif|svg|pdf|ico|eot|woff|ttf)$/i,
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
