// Nova versió compactada.

// require jquery
var $ = require('jquery-browserify');

// For use leaflet-image need mapbox...
// require leaflet.js
//var L = require('leaflet');

L_PREFER_CANVAS = true;
require('mapbox.js')

//Plugin KML
require('./plugins/KML');

// Private Global functions
var gUUID = require('./gUUID.js');

// modul del mapa
var mapa = require('./bpm');


$(document).ready(function(){

  myMapa = new mapa('map');
  //myMapa.load();
  $('.toggle-nav').click(function(e) {
    $(this).toggleClass('active');
    $('.menu ul').toggleClass('active');

    e.preventDefault();
  });
});

// Define $.put and $.delete
jQuery.each( [ 'put', 'delete', 'post', 'get' ], function( i, method ) {
  jQuery[ method ] = function( url, data, callback, type ) {
    if ( jQuery.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return jQuery.ajax({
      url: url,
      type: method,
      contentType: 'application/json',
      dataType: type,
      data: data,
      success: callback
    });
  };
});
