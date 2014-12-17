var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    DataTables = require('datatables'),    // will do for now, but slow and limited
    Dataset = require('../lib/dataset.js');


var GridView = Backbone.View.extend({
  el : '.datacomposer main > #grid',
  template: require('../templates/grid.tpl'),

  initialize : function() {
    Dataset.on('change', this.render, this);
  },

  render : function() {
    var cols = _.map(Dataset.visibleColumns(), function(col) {
      return {
        data: col.name,
        name: col.name,
        title: col.name
      };
    });
    
    this.$el.html( this.template({ dataset: Dataset }) );
    this.$('table').dataTable({
      columns: cols,
      data: Dataset.set,
      destroy: true
    });
  }
});


module.exports = GridView;
