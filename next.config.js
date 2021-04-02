const withTM = require("next-transpile-modules")(["react-select-search"]);

module.exports = withTM({
  future: {
    webpack5: true,
  },
  webpack: (config, options) => {
    config.experiments = {
      topLevelAwait: true,
    };
    return config;
  },
});
