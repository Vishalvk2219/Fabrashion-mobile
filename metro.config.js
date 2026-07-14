// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// expo-sqlite's web build (wa-sqlite) imports a .wasm binary, which Metro only
// resolves if wasm is a known asset extension.
config.resolver.assetExts.push('wasm');

// wa-sqlite needs SharedArrayBuffer, which browsers only expose to a
// cross-origin-isolated document. Production hosting must send the same headers
// (see the expo-router `headers` plugin in app.json).
config.server.enhanceMiddleware = (middleware) => (req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  return middleware(req, res, next);
};

module.exports = config;
