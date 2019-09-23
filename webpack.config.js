module.exports = (_, argv) => {
  const isProd = argv.mode === "production";

  /** @type {import('webpack').Configuration} */
  const config = {
    target: "node",
    entry: "./src/extension.ts",
    mode: isProd ? "production" : "development",
    output: {
      filename: "extension.js",
      libraryTarget: "commonjs2"
    },
    devtool: isProd ? "source-map" : "inline-source-map",
    externals: { vscode: "commonjs vscode" },
    resolve: { extensions: [".ts", ".js"] },
    module: { rules: [{ test: /\.ts$/, loader: "ts-loader" }] }
  };

  return config;
};
