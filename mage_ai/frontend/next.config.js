const removeImports = require('next-remove-imports')();

module.exports = removeImports({
  async rewrites() {
    return [
      {
        source: '/proxy/5789/datasets',
        destination: '/datasets',
      },
      {
        source: '/proxy/5789',
        destination: '/datasets',
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    esmExternals: true
  },
  reactStrictMode: true,
});
