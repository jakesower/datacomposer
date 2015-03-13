// render the skeleton of the app, then initialize components

var $          = require('jquery'),
    _          = require('lodash'),
    Backbone   = require('backbone'),
    Controls   = require('./views/controls.js'),
    Grid       = require('./views/grid.js'),
    Dataset    = require('./lib/dataset.js'),
    Importer   = require('./lib/importer.js'),
    views      = {},
    DCTemplate = require('./templates/datacomposer.tpl');


function DataComposer(el, options) {
  this.el = el;
  this.options = options;

  Dataset.setSourceList(options.sources || {});  
  this.render();

  if( _.has(options, "initialSource") ) {
    Importer.import( options.initialSource ).then( Dataset.loadSource.bind( Dataset ) );
  }
}


DataComposer.prototype = {
  el: null,
  options: {},
  controls: null,

  render: function() {
    $( this.el ).addClass( "datacomposer" ).empty().append( DCTemplate() );
    
    new Controls( { el: $( this.el ).find( 'aside#tools' ) });
    new Grid();
  }
};


module.exports = DataComposer;
