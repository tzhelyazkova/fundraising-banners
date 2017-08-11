require( './styles_var.css' );
require( './wlightbox.css' );

// BEGIN Banner-Specific configuration
const bannerCloseTrackRatio = 0.01;
const sizeIssueTrackRatio = 1;
const CampaignName = 'C17_02_170724';
const BannerName = 'B17_02_170724_ctrl-test';
const LANGUAGE = 'de';

// END Banner-Specific configuration

const fundraisingBanner = {};

const DevGlobalBannerSettings = require( './GlobalBannerSettings' );
const GlobalBannerSettings = window.GlobalBannerSettings || DevGlobalBannerSettings;
const Translations = {}; // will only be needed for English banner, German defaults are in DesktopBanner
const BannerFunctions = require( './DesktopBanner' )( GlobalBannerSettings, Translations );
const SizeIssues = require( './track_size_issues' );
const getCampaignDaySentence = require( './count_campaign_days' )( GlobalBannerSettings[ 'campaign-start-date' ], GlobalBannerSettings[ 'campaign-end-date' ] );
const getCustomDayName = require( './custom_day_name' );
const TrackingEvents = require( './TrackingEvents' );

const bannerTemplate = require('./banner_var.hbs');

const $ = require( 'jquery' );
require( './wlightbox.js' );

const customDayName = getCustomDayName( BannerFunctions.getCurrentGermanDay, LANGUAGE );
const currentDayName = BannerFunctions.getCurrentGermanDay();
const weekdayPrepPhrase = customDayName === currentDayName ? 'an diesem' : 'am heutigen';

const $banner = $( '#WMDE-Banner-Container' );
$banner.html( bannerTemplate( {
    // TODO approx. donors
    customDayName: customDayName,
    currentDayName: currentDayName,
    weekdayPrepPhrase: weekdayPrepPhrase,
    campaignDaySentence: getCampaignDaySentence( LANGUAGE ),
    daysRemaining: BannerFunctions.getDaysRemaining( LANGUAGE ),
    CampaignName: CampaignName,
    BannerName: BannerName
} ) );

// BEGIN form init code

const trackingLinkGenerator = new TrackingEvents( BannerName, $( '#WMDE_Banner-close-ct' ) );

function setupValidationEventHandling() {
  var banner = $( '#WMDE_Banner' );
  banner.on( 'validation:amount:ok', function () {
      $( '#WMDE_Banner-amounts-error-text' ).hide();
      $( '#WMDE_Banner-amounts' ).removeClass( 'fieldset-error' );
      addSpaceInstantly();
  } );
  banner.on( 'validation:amount:error', function ( evt, text ) {
      $( '#WMDE_Banner-amounts-error-text' ).text( text ).show();
      $( '#WMDE_Banner-amounts' ).addClass( 'fieldset-error' );
      addSpaceInstantly();
  } );
  banner.on( 'validation:period:ok', function () {
      $( '#WMDE_Banner-frequency-error-text' ).hide();
      $( '#WMDE_Banner-frequency' ).removeClass( 'fieldset-error' );
      addSpaceInstantly();
  } );
  banner.on( 'validation:period:error', function ( evt, text ) {
      $( '#WMDE_Banner-frequency-error-text' ).text( text ).show();
      $( '#WMDE_Banner-frequency' ).addClass( 'fieldset-error' );
      addSpaceInstantly();
  } );
}

function setupAmountEventHandling() {
      var banner = $( '#WMDE_Banner' );
      // using delegated events with empty selector to be markup-independent and still have corrent value for event.target
      banner.on( 'amount:selected', null, function( evt ) {
          $( '#amount-other-input' ).val( '' );
          $( '#WMDE_Banner' ).trigger( 'validation:amount:ok' );
      } );

      banner.on( 'amount:custom', null, function( evt ) {
          $( '#WMDE_Banner-amounts .select-group__input' ).prop( 'checked', false );
          $( '#WMDE_Banner' ).trigger( 'validation:amount:ok' );
      } );
}

function validateAndSetPeriod() {
    var selectedInterval = $( '#WMDE_Banner-frequency input[type=radio]:checked' ).val();
    if ( typeof selectedInterval === 'undefined' ) {
        BannerFunctions.showFrequencyError( 'Bitte wählen Sie zuerst ein Zahlungsintervall.' );
        return false;
    }
    $( '#intervalType' ).val( selectedInterval > 0 ? '1' : '0' );
    $( '#periode' ).val( selectedInterval );
	BannerFunctions.hideFrequencyError();
	return true;
}

$( '#WMDE_Banner-payment button' ).click( function( e ) {
    $( '#zahlweise' ).val( $( this ).data( 'payment-type' ) );
  if ( !validateAndSetPeriod() || !BannerFunctions.validateAmount( BannerFunctions.getAmount() ) ) {
      e.preventDefault();
      return false;
  }
} );

/* Convert browser events to custom events */
$( '#WMDE_Banner-amounts' ).find( 'label' ).click( function () {
  $( this ).trigger( 'amount:selected' );
} );

$( '#amount-other-input' ).change( function () {
  $( this ).trigger( 'amount:custom' );
} );

$( '#interval_onetime' ).on( 'click', function () {
    BannerFunctions.hideFrequencyError();
    $( '#interval_onetime' ).prop( 'checked', true );
    $( '#interval_multiple' ).prop( 'checked', false );
}  );

$( '#interval_multiple' ).on( 'click', function () {
    $( '#interval_multiple' ).prop( 'checked', true );
    $( '#interval_onetime' ).prop( 'checked', false );
} );
$( '.donation-interval' ).on( 'click', function () {
    BannerFunctions.hideFrequencyError();
} );

BannerFunctions.initializeBannerEvents();


// END form init code

function addSpace() {
  if ( !$( '#WMDE_Banner' ).is( ':visible' ) ) {
    return;
  }
  var bannerHeight = $( 'div#WMDE_Banner' ).height(),
      skin = BannerFunctions.getSkin();

  switch ( skin ) {
    case 'vector':
      SizeIssues.trackSizeIssues(
          $( 'div#WMDE_Banner' ),
          trackingLinkGenerator.getTrackingURL( 'banner-size-issue' ),
          sizeIssueTrackRatio
      );
      $( '#mw-panel' ).animate( {'top':bannerHeight + 160},1000 );
      $( '#mw-head' ).animate( {'top':bannerHeight},1000 );
      $( '#mw-page-base' ).animate( {'padding-top':bannerHeight},1000);
    case 'minerva':
      $( '#mw-mf-viewport' ).animate( {'top':bannerHeight},1000 );
      break;
  }
}

function addSpaceInstantly() {
  if ( !$( '#WMDE_Banner' ).is( ':visible' ) ) {
    return;
  }
  var bannerHeight = $( 'div#WMDE_Banner' ).height(),
      skin = BannerFunctions.getSkin();

  switch ( skin ) {
    case 'vector':
      $( '#mw-panel' ).css( { top: bannerHeight + 160 } );
      $( '#mw-head' ).css( { top: bannerHeight } );
      $( '#mw-page-base' ).css( { paddingTop: bannerHeight } );
    case 'minerva':
      $( '#mw-mf-viewport' ).css( { top: bannerHeight } );
      break;
  }
}

function removeBannerSpace() {
    // TODO test with real Wikpedia assets, check if we need to remove banner space.
}

function displayBanner() {
  var bannerElement = $( '#WMDE_Banner' ),
      bannerHeight = bannerElement.height();

  setupValidationEventHandling();
  setupAmountEventHandling();

  $( 'body' ).prepend( $( '#centralNotice' ) );
  bannerElement.css( 'top', -bannerHeight );
  bannerElement.css( 'display', 'block' );
  addSpace();
  bannerElement.animate( { top: 0 }, 1000 );

  $( window ).resize( function () {
    addSpaceInstantly();
    calculateLightboxPosition();
  } );
}

function calculateLightboxPosition() {
    $( '#wlightbox' ).css( {
        right: ( $('body').width() - 750 ) / 2 + 'px', top: '20px',
        top: ( $( '#WMDE_Banner' ).height() + 20 ) + 'px'
    } );
}

var impCount = BannerFunctions.increaseImpCount();
$( '#impCount' ).val( impCount );
var bannerImpCount = BannerFunctions.increaseBannerImpCount( BannerName );
$( '#bImpCount' ).val( bannerImpCount );

// Lightbox
$( '#application-of-funds-link' ).wlightbox( {
    container: $( '#mw-page-base' ),
    right: ( $('body').width() - 750 ) / 2 + 'px',
    top: function() {
        return ( $( '#WMDE_Banner' ).height() + 20 ) + 'px';
    }
} );

$( '#application-of-funds-link' ).click( function () {
    // Lightbox position is relative to banner position
    window.scrollTo(0,0);
} )

// track lightbox link clicking and banner closing
trackingLinkGenerator.trackClickEvent( $( '#application-of-funds-link' ), 'application-of-funds-lightbox-opened' );
trackingLinkGenerator.trackClickEvent( $( '#link-wmf-annual-plan' ), 'wmf-annual-plan' );
trackingLinkGenerator.trackClickEvent( $( '#link-wmde-annual-plan' ), 'wmde-annual-plan' );
trackingLinkGenerator.trackClickEvent( $( '#WMDE_Banner-close' ), 'wmde-annual-plan', 'banner-closed', bannerCloseTrackRatio );

// BEGIN Banner close functions
$( '#WMDE_Banner-close a' ).click( function () {
    $( '#WMDE_Banner' ).hide();
    if ( BannerFunctions.onMediaWiki() ) {
        mw.centralNotice.hideBanner();
    }
    removeBannerSpace();

    return false;
} );

// hide banner when the visual editor is initialized
$( '#ca-ve-edit, .mw-editsection-visualeditor' ).click( function () {
    $( '#WMDE_Banner' ).hide();
    removeBannerSpace();
} );

// END Banner close functions

// Display banner on load
$( function () {
  if ( BannerFunctions.onMediaWiki() && window.mw.config.get( 'wgAction' ) !== "view" ) {
    return;
  }
  setTimeout( displayBanner, $( '#WMDE-BannerPreview' ).data( 'delay' ) || 7500 );
} );
