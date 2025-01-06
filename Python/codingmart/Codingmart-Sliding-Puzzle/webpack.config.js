module.exports = {
  context: __dirname,
  entry: "./lib/main.js",
  output: {
    filename: "./lib/bundle.js",
    devtoolModuleFilenameTemplate: '[resourcePath]',
    devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
  },
  devtool: 'source-maps'
};
