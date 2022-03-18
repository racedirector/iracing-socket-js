/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const fs = require('fs');
const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const getWorkspaces = require('get-yarn-workspaces');

const workspaceDir = path.resolve(__dirname, '../../');
const workspaceModules = path.resolve(workspaceDir, 'node_modules');
const workspaces = getWorkspaces(__dirname);

const watchFolders = [workspaceModules, ...workspaces];

const rnwPath = fs.realpathSync(
  path.resolve(require.resolve('react-native-windows/package.json'), '..'),
);

const bobPrepackArtifactsIgnore = workspaces.map(
  workspacePath => new RegExp(`${workspacePath}/dist/package.json`),
);

module.exports = {
  projectRoot: __dirname,
  watchFolders: watchFolders,
  resetCache: true,
  resolver: {
    platforms: ['ios', 'android', 'macos', 'windows', 'native'],
    blockList: exclusionList([
      // This stops "react-native run-windows" from causing the metro server to crash if its already running
      new RegExp(
        `${path.resolve(__dirname, 'windows').replace(/[/\\]/g, '/')}.*`,
      ),
      // This prevents "react-native run-windows" from hitting: EBUSY: resource busy or locked, open msbuild.ProjectImports.zip or other files produced by msbuild
      new RegExp(`${rnwPath}/build/.*`),
      new RegExp(`${rnwPath}/target/.*`),
      /.*\.ProjectImports\.zip/,

      ...bobPrepackArtifactsIgnore,
    ]),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
