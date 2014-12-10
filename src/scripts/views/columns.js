var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Dataset = require('../lib/dataset.js'),
    template = require('../templates/controls/columns.tpl'),
    columnTemplate = require('../templates/controls/columns-column.tpl');


var FiltersView = Backbone.View.extend({

  // pretty unhappy that I can't bind to each row--there must be a better way!
  events: {
    "click input": "update",
  },

  initialize: function() {
    Dataset.on('change:groupFilters', this.render, this);
  },

  render: function() {
    this.$el.html(template({dataset: Dataset}));
  },



  update: function(e) {
    var elt = e.target,
        columnId = elt.dataset.columnid,
        field = elt.dataset.field,
        column = Dataset.columnsById[columnId],
        changes = {};

    changes[field] = $(elt).prop('checked');
    column.set(changes);
  }

});



module.exports = FiltersView;