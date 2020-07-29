const compose = (plugins) => ({
  webpack(config, options) {
    return plugins.reduce((config, plugin) => {
      if (plugin instanceof Array) {
        const [_plugin, ...args] = plugin;
        plugin = _plugin(...args);
      }
      if (plugin instanceof Function) {
        plugin = plugin();
      }
      if (plugin && plugin.webpack instanceof Function) {
        return plugin.webpack(config, options);
      }
      return config;
    }, config);
  },

  webpackDevMiddleware(config) {
    return plugins.reduce((config, plugin) => {
      if (plugin instanceof Array) {
        const [_plugin, ...args] = plugin;
        plugin = _plugin(...args);
      }
      if (plugin instanceof Function) {
        plugin = plugin();
      }
      if (plugin && plugin.webpackDevMiddleware instanceof Function) {
        return plugin.webpackDevMiddleware(config);
      }
      return config;
    }, config);
  },
});

const withBundleAnalyzer = require("@next/bundle-analyzer");
const withLess = require("@zeit/next-less");
module.exports = withLess();
// module.exports = compose([
//   [
//     withBundleAnalyzer,
//     {
//       enabled: process.env.ANALYZE === "true",
//     },
//     withLess({
//       cssModules: true,
//       lessLoaderOptions: {
//         javascriptEnabled: true,
//       },
//       webpack: (config, { isServer }) => {
//         if (isServer) {
//           const antStyles = /antd\/.*?\/style.*?/;
//           const origExternals = [...config.externals];
//           config.externals = [
//             (context, request, callback) => {
//               if (request.match(antStyles)) return callback();
//               if (typeof origExternals[0] === "function") {
//                 origExternals[0](context, request, callback);
//               } else {
//                 callback();
//               }
//             },
//             ...(typeof origExternals[0] === "function" ? [] : origExternals),
//           ];

//           config.module.rules.unshift({
//             test: antStyles,
//             use: "null-loader",
//           });
//         }
//         return config;
//       },
//     }),
//   ],
// ]);
