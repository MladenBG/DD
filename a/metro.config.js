const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.blacklistRE = /android\/.*/; 
config.resolver.exclusionList = [/android\/.*/];

module.exports = config;