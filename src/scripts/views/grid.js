var _ = require('lodash'),
    Backbone = require('backbone'),
    Dataset = require('../lib/dataset.js');


var GridView = Backbone.View.extend({
  el : '#grid',
  dataset : null,
  template: require('../templates/grid.tpl'),

  initialize : function() {
    Dataset.on('change', function(set) {
      this.dataset = set;
      this.render();
    }, this);

  },

  render : function() {
    if(this.dataset) {
      this.$el.html( this.template({ dataset: this.dataset }) );
    }
  }
});


module.exports = GridView;
