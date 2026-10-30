const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

// 1. Find the project and workspace directories
const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

// 2. Get the default Expo Metro config
const config = getDefaultConfig(projectRoot)

// 3. Monorepo adjustments: Watch all files within the workspace root
config.watchFolders = [workspaceRoot]

// 4. Monorepo adjustments: Force Metro to resolve node_modules correctly
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]
config.resolver.disableHierarchicalLookup = true

// 5. Wrap the monorepo config with NativeWind
module.exports = withNativeWind(config, { input: './src/global.css' })
