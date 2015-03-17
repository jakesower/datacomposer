var $ = require( 'jquery' ),
    _ = require( 'lodash' ),
    Backbone = require( 'backbone' ),
    DataComposer = require( '../datacomposer.js' ),
    Utils = require( '../lib/utils.js' ),
    template = require( '../templates/controls/source.tpl' ),
    treetemplate = require( '../templates/controls/source-tree.tpl' ),
    Importer = require( '../lib/importer.js' );


var SourceView = Backbone.View.extend( {

  viewMode: 'flat',

  events: {
    "change #csv": "importCSV",
    "click #importURL": "importUserURL",
    "click #loadSource": "importPredefinedURL"
  },

  initialize: function( options ) {
    DataComposer.on( 'change:sourceList', this.render, this );
    this.viewMode = options.viewMode || 'flat';
    this.render();
  },


  render: function() {
    if( this.viewMode === 'tree' ) {
      // this.$el.html( treetemplate( {dataset: DataComposer} ) );
      // this.addNodes();
    }

    else {
      this.$el.html( template( {sourceList: DataComposer.sourceList} ) );
    }
  },


  importCSV: function() {
    var reader = new FileReader(),
        file = $( '#csv' ).prop( 'files' )[0];

    if( !file ) { return null; }

    reader.onload = _.bind( function() {
      var imported = Importer.importCSV( reader.result );
      DataComposer.loadSource( imported );
    }, this );
    
    reader.readAsText( file );
  },


  importPredefinedURL: function() {
    var sourceID = this.$( "#predefinedURL" ).val(),
        url = DataComposer.sourceList[sourceID].value;
    this.importURL(url);
  },


  importUserURL: function() {
    var url = this.$( "userURL" ).val();
    this.importURL( url );
  },


  importURL: function( url ) {
    Utils.Loader.loading(function() {
      return Importer.importURL( url ).then(
        function( imported ) { DataComposer.loadSource( imported ); },
        function() { console.log ('Error importing '+url); }
      );
    }, "Importing", this );
  },


  addNodes: function() {
    var ul = this.$el.find( 'ul#source' )[0];
    console.log(ul);
    _.each( DataComposer.sourceList, function( source ) {
      ul.appendChild( this.addNode( source ) );
    }, this);
  },


  addNode: function(data) {
    var elt = document.createElement('li');

    elt.appendChild( document.createTextNode( data.name ) );
    if( _.has(data, 'children') ) {
      var ul = document.createElement('ul');

      _.each( data.children, function( child ) {
        ul.appendChild( addNode( child ) );
      });

      elt.appendChild(ul);
    }

    return elt;
  }
  

} );



module.exports = SourceView;