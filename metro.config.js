const { getDefaultConfig } = require('expo/metro-config');

const defaultconfig = getDefaultConfig(__dirname);
getDefaultConfig.resolver.assetExts.push("cjs")

module.exports = defaultconfig;
