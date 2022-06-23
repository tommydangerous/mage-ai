const removeImports = require('next-remove-imports')();

module.exports = removeImports({
  basePath: '/proxy/5789',
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    esmExternals: true
  },
  reactStrictMode: true,
});
