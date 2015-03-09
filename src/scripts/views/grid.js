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


  initialize : function() {
    Dataset.on( 'change', this.render, this );
  },


  render : function() {
    var cols, rows,
        page = this.page,
        perPage = this.perPage;

    cols = Dataset.visibleColumns().map( function(col) {
      return col.name;
    });

    rows = Dataset.set.slice( (page - 1)*perPage, perPage );

    this.$el.html( this.template({ 
      columns: cols,
      rows: rows,
      page: page,
      perPage: perPage
    }) );
    
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