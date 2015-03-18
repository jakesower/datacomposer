var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    DataComposer = require('../datacomposer.js'),
    template = require('../templates/controls/columns.tpl'),
    columnTemplate = require('../templates/controls/columns-column.tpl');


var ColumnsView = Backbone.View.extend({

  // pretty unhappy that I can't bind to each row--there must be a better way!
  events: {
    "click tr": "update",
  },

  initialize: function() {
    DataComposer.on( 'change:columns', this.render, this );
  },

  render: function( collection ) {
    this.$el.html(template({
      columns: collection.columns,
      selectedColumns: DataComposer.columns // can we separate concerns better?
    }));
  },



  update: function(e) {
    var elt = e.target,
        columnId = elt.dataset.columnid,
        field = elt.dataset.field,
        column = DataComposer.columnsById[columnId],
        changes = {};

    changes[field] = $(elt).prop('checked');
    column.set(changes);
  }

});


module.exports = ColumnsView;
