var $ = require( 'jquery' ),
    _ = require( 'lodash' ),
    Backbone = require( 'backbone' ),
    Dataset = require( '../lib/dataset.js' ),
    Utils = require( '../lib/utils.js' ),
    template = require( '../templates/controls/source.tpl' ),
    Importer = require( '../lib/importer.js' );


var SourceView = Backbone.View.extend( {

  events: {
    "change #csv": "importCSV",
    "click #loadSource": "importURL"
  },

  initialize: function() {
    Dataset.on( 'change:sourceList', this.render, this );
    this.render();
  },

  render: function() {
    this.$el.html( template( {dataset: Dataset} ) );
  },



  importCSV: function() {
    var reader = new FileReader(),
        file = $( '#csv' ).prop( 'files' )[0];

    if( !file ) { return null; }

    reader.onload = _.bind( function() {
      var imported = Importer.importCSV( reader.result );
      Dataset.loadSource( imported );
    }, this );
    
    reader.readAsText( file );
  },


  importURL: function() {
    var sourceID = this.$( "#source" ).val(),
        url = Dataset.sourceList[sourceID].value;

    Importer.importURL(url).then( function( imported ) {
      Dataset.loadSource( imported );
    });
  }

} );



module.exports = SourceView;