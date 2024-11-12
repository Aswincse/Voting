module.exports = {
    resolve: {
      fallback: {
        "url": require.resolve("url/"),
        "util": require.resolve("util/"),
        "crypto": require.resolve("crypto-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "fs": false,  // Use "false" if you don't need fs for the browser environment
        "net": false,  // Use "false" if you don't need net for the browser environment
        "tls": false  // Use "false" if you don't need tls for the browser environment
      }
    }
  };
  