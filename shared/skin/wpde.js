'use strict';

const Skin = require( './Skin' );
const $ = require( 'jquery' );

module.exports = class Wpde extends Skin {
	constructor() {
		super();

		this.container = $( 'body center' );
	}

	addSpace( bannerHeight ) {
		this.container.animate( { 'margin-top': bannerHeight }, 1000 );
	}

	addSpaceInstantly( bannerHeight ) {
		this.container.css( 'margin-top', bannerHeight );
	}

	removeSpace() {
		this.container.css( 'margin-top', 0 );
	}
};
