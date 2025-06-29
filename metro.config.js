const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer'
);
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg'
);
config.resolver.sourceExts.push('svg');

// Exclude livekit-server-sdk from bundling to prevent Node.js module errors
config.resolver.platforms = ['native', 'android', 'ios', 'web'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Exclude Node.js modules and server SDK from client bundling
config.resolver.excludeNodeModulesFromBundle = [
  'livekit-server-sdk',
  'jsonwebtoken',
  'jws',
  'jwa',
  'buffer',
  'crypto',
  'stream',
  'util',
  'events',
  'path',
  'fs',
  'os',
  'url',
  'querystring',
  'http',
  'https',
  'zlib',
  'assert',
  'constants',
  'domain',
  'punycode',
  'timers',
  'tty',
  'vm',
  'worker_threads',
  'child_process',
  'cluster',
  'dgram',
  'dns',
  'net',
  'readline',
  'repl',
  'string_decoder',
  'tls',
  'trace_events',
  'v8',
  'perf_hooks',
  'async_hooks',
  'inspector',
  'module',
  'process',
];

// Add resolver configuration to handle Node.js modules
config.resolver.alias = {
  ...config.resolver.alias,
  'node:crypto': false,
  'node:buffer': false,
  'node:util': false,
  'node:stream': false,
  'node:events': false,
  'node:path': false,
  'node:fs': false,
  'node:os': false,
  'node:url': false,
  'node:querystring': false,
  'node:http': false,
  'node:https': false,
  'node:zlib': false,
  'node:assert': false,
  'node:constants': false,
  'node:domain': false,
  'node:punycode': false,
  'node:timers': false,
  'node:tty': false,
  'node:vm': false,
  'node:worker_threads': false,
  'node:child_process': false,
  'node:cluster': false,
  'node:dgram': false,
  'node:dns': false,
  'node:net': false,
  'node:readline': false,
  'node:repl': false,
  'node:string_decoder': false,
  'node:tls': false,
  'node:trace_events': false,
  'node:v8': false,
  'node:perf_hooks': false,
  'node:async_hooks': false,
  'node:inspector': false,
  'node:module': false,
  'node:process': false,
  'node:querystring': false,
  'node:url': false,
  'node:util': false,
  'node:vm': false,
  'node:worker_threads': false,
};

module.exports = config;
