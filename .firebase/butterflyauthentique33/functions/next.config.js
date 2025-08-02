"use strict";

// next.config.js
var nextConfig = {
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};
module.exports = nextConfig;
