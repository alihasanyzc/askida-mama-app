const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Watch the client directory so Metro finds all source files
config.watchFolders = [
    path.resolve(projectRoot, 'client'),
];

module.exports = config;
