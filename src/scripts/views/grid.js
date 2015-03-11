var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Utils = require('../lib/utils.js'),
    Dataset = require('../lib/dataset.js');


var GridView = Backbone.View.extend({
  el : '.datacomposer main > #grid',
  template: require('../templates/grid.tpl'),

  page: 1,
  perPage: 20,

  events: {
    "click .page" : "changePage",
    "click #goToPage" : "goToPage"
  },


  initialize : function() {
    Dataset.on( 'change', this.render, this );
  },


  render : function() {
    var cols, rows,
        perPage = this.perPage,
        numPages = Math.ceil(Dataset.set.length / perPage),
        page = Math.max( Math.min( this.page, numPages ), 1 );

    cols = Dataset.visibleColumns().map( function(col) {
      return col.name;
    });

    rows = Dataset.set.slice( (page - 1)*perPage, page*perPage );

    this.$el.html( this.template({ 
      columns: cols,
      rows: rows,
      page: page,
      perPage: perPage,
      numPages: numPages
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