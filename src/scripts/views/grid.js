var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Utils = require('../lib/utils.js'),
    DataComposer = require('../datacomposer.js');


var GridView = Backbone.View.extend({
  el : '.datacomposer main > #grid',
  template: require('../templates/grid.tpl'),
  collection: null, // cached version so we can manipulate in widget

  page: 1,
  perPage: 20,

  events: {
    "click .page" : "changePage",
    "click #goToPage" : "goToPage",
    "change #perPage" : "setPerPage",
    "click #dataTable th" : "changeSortOrder"
  },


  initialize : function() {
    DataComposer.on( 'change', function( collection ) {
      this.collection = collection;
      this.render();
    }, this );
  },


  render : function() {
    var cols, rows,
        collection = this.collection,
        perPage = this.perPage,
        numPages = Math.ceil( collection.rows.length / perPage ),
        page = Math.max( Math.min( this.page, numPages ), 1 );

    rows = collection.rows.slice( (page - 1)*perPage, page*perPage );

    this.$el.html( this.template({ 
      columns: collection.columns,
      rows: rows,
      page: page, 
      perPage: perPage,
      numPages: numPages,
      numResults: collection.rows.length,
      sortOrder: DataComposer.sortOrder
    }) );
    
  },


  changePage: function( e ) {
    this.page = parseInt( e.target.dataset.page );
    this.render();
  },


  goToPage: function( e ) {
    var page = parseInt( this.$( "#setPage" ).val() );
    if( page ) { this.page = page; }
    this.render();
  },


  setPerPage: function( e ) {
    this.perPage = parseInt( ( $( e.target ).val() ) );
    this.render();
  },


  changeSortOrder: function( e ) {
    var th = e.currentTarget,
        thead = th.parentNode,
        columnID = th.dataset.columnid,
        direction = 'asc',
        currentOrder = DataComposer.sortOrder,
        node = thead.children;

    for( var i=0; i < thead.children.length; ++i ) {
      node = thead.children[i];
      node.classList.remove( "sorted-asc" );
      node.classList.remove( "sorted-desc" );
      node = node.nextSibling;
    }
    
    if( currentOrder.column ==  columnID ) {
      direction = (currentOrder.direction == 'asc') ? 'desc' : 'asc';
    }

    DataComposer.setSortOrder({
      column: columnID,
      direction: direction
    });
  }

});


module.exports = GridView;



/*
 * Grid needs the following properties:
 *
 * Pagination
 * Sorting -- ▲ and ▼  or   ▴ and ▾
 * "Instant" update on dataset changes
 *
 * Search over visible text fields
*/