const webpack = require("webpack"),
	path = require("path"),
	CopyPlugin = require('copy-webpack-plugin'),
	MiniCssExtractPlugin = require('mini-css-extract-plugin'),
	TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin'),
	VueLoader = require('vue-loader');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	context: __dirname,
	entry: {
		client: ['./index.ts']
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, "../../dist/client"),
		chunkFilename: "[chunkhash].js",
		publicPath: '/'
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: 'index.html', to: '.' },
				{ from: 'favicon.ico', to: '.' }
			]
		}),
		new MiniCssExtractPlugin({filename: 'index.css'}),
		new VueLoader.VueLoaderPlugin(),
		new webpack.ProvidePlugin({
			$: 'jquery'
		})
	],
	module: {
		rules: [{
			test: /\.tsx?$/,
			exclude: /node_modules/,
			loader: 'ts-loader',
			options: {
				appendTsSuffixTo: [/\.vue$/]
			}
		}, {
			test: /\.css$/,
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader'
			]
		}, {
			test: /\.scss$/,
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader',
				'sass-loader'
			]
		}, {
			enforce: 'pre',
			test: /\.tsx?$/,
			exclude: /node_modules/,
			use: "source-map-loader"
		}, {
			test: /\.vue$/,
			loader: 'vue-loader',
			options: {
				loaders: {
					ts: 'ts-loader'
				}
			}
		}, {
			test: /\.(eot|svg|ttf|woff|woff2)$/,
			loader: 'file-loader',
			options: {
				name: 'public/fonts/[name].[ext]'
			}
		}, {
			test: /\.(png|jpe?g|gif)$/,
			loader: 'file-loader',
			options: {
				name: 'public/images/[name].[ext]'
			}
		}]
	},
	resolve: {
		plugins: [new TsconfigPathsPlugin({})],
		extensions: ['.ts', '.js', '.vue']
	}
};