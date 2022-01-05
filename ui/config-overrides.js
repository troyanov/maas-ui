const webpack = require("webpack");

module.exports = {
  webpack: function (config, env) {
    config.entry = "./src/single-spa-entry.js";
    config.output = {
      ...config.output,
      filename: "ui.js",
      libraryTarget: "umd",
    };
    config.optimization = {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: "styles",
            test: /\.css$/,
            chunks: "all",
            enforce: true,
          },
        },
        chunks: "all",
      },
    };
    // webpack < 5 used to include polyfills for node.js core modules by default
    // but no longer does. The @canonical/macaroon-bakery package uses some core
    // module, so we include polyfills here.
    // https://github.com/juju/bakeryjs/issues/35
    config.resolve.fallback = {
      buffer: require.resolve("buffer"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util"),
    };
    config.plugins = config.plugins.filter(
      (plugin) => plugin.constructor.name !== "HtmlWebpackPlugin"
    );
    config.plugins.push(
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      })
    );
    return config;
  },
  devServer: function (configFunction) {
    return function () {
      const config = configFunction();
      config.devMiddleware.writeToDisk = true;
      return config;
    };
  },
};
