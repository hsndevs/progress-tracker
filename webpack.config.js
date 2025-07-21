const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/js/app.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/bundle.js',
		clean: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html',
		}),
		new HtmlWebpackPlugin({
			template: './src/report.html',
			filename: 'report.html',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'src/css', to: 'css' },
				{ from: 'src/js/firebase-config.js', to: 'js/firebase-config.js' },
				{ from: 'src/firebase-env.js', to: 'firebase-env.js' },
			],
		}),
	],
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		compress: true,
		port: 3000,
	},
	mode: 'development',
};
