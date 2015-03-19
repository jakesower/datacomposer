var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    DataComposer = require('../datacomposer.js'),
    template = require('../templates/controls/columns.tpl'),
    columnTemplate = require('../templates/controls/columns-column.tpl');


var ColumnsView = Backbone.View.extend({
  collection: null,

  events: {
    "click tr": "update",
  },

  initialize: function() {
    // DataComposer.on( 'change:columns', function( collections ) {
    //   console.log(collections);
    //   this.collection = collections.from;
    //   this.render();
    // }, this );
    DataComposer.on( 'change:columns', this.render, this );
  },

  render: function( collections ) {
    this.$el.html(template({
      columns: collections.from.columns,
      selectedColumns: DataComposer.columns // can we separate concerns better?
    }));
  },



  update: function( e ) {
    var elt = e.currentTarget,
        columnID = elt.dataset.columnid;

    if( _.include( DataComposer.columns, columnID ) ) {
      DataComposer.removeColumn( columnID );
    }
    else {
      DataComposer.addColumn( columnID );
    }
  }

});


module.exports = ColumnsView;
