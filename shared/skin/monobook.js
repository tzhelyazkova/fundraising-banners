'use strict';

const Skin = require( './Skin' );
const $ = require( 'jquery' );

module.exports = class Monobook extends Skin {
	constructor() {
		super();

		this.globalWrapper = $( '#globalWrapper' );
	}

	addSpace( bannerHeight ) {
		this.globalWrapper.animate( { top: bannerHeight }, 1000 );
	}

	addSpaceInstantly( bannerHeight ) {
		this.globalWrapper.css( 'top', bannerHeight );
	}

	removeSpace() {
		this.globalWrapper.css( 'top', 0 );
	}
};
