// render the skeleton of the app, then initialize components

var $            = require('jquery'),
    Backbone     = require('backbone'),
    DataComposer = require('./datacomposer'),
    Controls = require('./views/controls.jsx'),
    Grid = require('./views/grid.js'),
    DCTemplate   = require ('./templates/datacomposer.tpl');


Backbone.$ = $;

// interface for the outside world
function DataComposerApp( el, options ) {
  DataComposer.initialize( options );
  this.el = el;
  this.render();
}


DataComposerApp.prototype = {
  el: null,

  render: function() {
    $( this.el ).addClass( "datacomposer" ).empty().append( DCTemplate() );
    
    new Controls( { el: $( this.el ).find( 'aside#tools' ) });
    new Grid();
  }

};


module.exports = DataComposerApp;
