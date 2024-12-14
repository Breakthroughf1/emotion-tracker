module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add a rule for source-map-loader
      webpackConfig.module.rules.push({
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: /node_modules/, // Ignore source maps for node_modules
      });

      return webpackConfig;
    },
  },
};
