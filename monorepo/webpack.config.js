// monorepo/webpack.config.js
const path = require("path");

module.exports = {
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
    cacheDirectory: path.resolve(__dirname, ".webpack-cache"),
    compression: "gzip",
    store: "pack",
    packFileStrategy: {
      createPackFile: async (content, { fileSystem, name }) => {
        // If the content is a large string, use Buffer
        if (typeof content === "string" && content.length > 64 * 1024) {
          return Buffer.from(content);
        }
        return content;
      },
      restorePackFile: async (content, { fileSystem, name }) => {
        // Restore Buffer as a string
        if (Buffer.isBuffer(content)) {
          return content.toString("utf-8");
        }
        return content;
      },
    },
  },
  // Other Webpack configuration
};
