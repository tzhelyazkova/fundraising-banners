const fs = require( 'fs' );
const toml = require( 'toml' );
const Merge = require( 'webpack-merge' );
const CommonConfig = require( './webpack.common.js' );
const webpack = require( 'webpack' );

module.exports = Merge( CommonConfig, {
	entry: {
		loader: './webpack/loader.js'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin( {
			CAMPAIGNS: JSON.stringify( toml.parse( fs.readFileSync( 'campaign_info.toml', 'utf8' ) ) )
		} )
	],
	devServer: {
		port: 8084,
		hot: true,
		contentBase: './dist',
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		proxy: [
			{
				context: [ '/wikipedia.de', '/FundraisingBanners', '/img', '/js', '/style.css', '/suggest.js' ],
				pathRewrite: { '^/wikipedia.de': '' },
				target: 'https://wikipedia.de',
				changeOrigin: true
			},
			{
				context: [ '/wiki', '/w', '/static' ],
				target: 'https://de.wikipedia.org',
				changeOrigin: true
			}
		]
	}
} );
