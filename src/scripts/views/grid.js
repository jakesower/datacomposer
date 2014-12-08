var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    DataTables = require('datatables'),    // will do for now, but slow and limited
    Dataset = require('../lib/dataset.js');


var GridView = Backbone.View.extend({
  el : 'main',
  template: require('../templates/grid.tpl'),

  initialize : function() {
    Dataset.on('change', function() {
      this.render();
    }, this);

    Dataset.on('column:change', function() {
      this.render();
    }, this);

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
    // console.log(cols);
    this.$('table').dataTable({
      columns: cols,
      data: Dataset.set,
      destroy: true
    });
  }
});


module.exports = GridView;
