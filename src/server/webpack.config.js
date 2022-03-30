var webpack = require("webpack"),
	path = require("path"),
	CopyPlugin = require('copy-webpack-plugin'),
	TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin'),
	nodeExternals = require('webpack-node-externals');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	context: __dirname,
	target: 'node',
	externals: [nodeExternals()],
	entry: {
		server: [path.resolve(__dirname, './index.ts')]
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, "../../dist/server")
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: './doc/*', to: '.' }
			]
		})
	],
	module: {
		rules: [{
			test: /\.tsx?$/,
			loader: 'ts-loader'
		}, {
			enforce: 'pre',
			test: /\.tsx?$/,
			use: "source-map-loader"
		}]
	},
	resolve: {
		plugins: [new TsconfigPathsPlugin({configFile: './src/server/tsconfig.json'})],
		extensions: ['.ts', '.js']
	}
};