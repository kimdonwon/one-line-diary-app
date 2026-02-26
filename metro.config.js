// Node.js 18 호환성을 위한 폴리필 (Metro bundler 용)
if (typeof URL.canParse !== 'function') {
    URL.canParse = function (url, base) {
        try {
            new URL(url, base);
            return true;
        } catch {
            return false;
        }
    };
}

const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = false;

module.exports = config;
