var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Dataset = require('../lib/dataset.js'),
    GroupFunctions = require('../lib/group-functions.js'),
    template = require('../templates/controls/group-columns.tpl');


var GroupColumnsView = Backbone.View.extend({

  events: {
    "click input": "update",
  },

  initialize: function() {
    Dataset.on('change:groupings', this.render, this);
  },

  render: function() {
    this.$el.html( template( {
      dataset: Dataset,
      groupFunctions: GroupFunctions
    }));
  },



  update: function(e) {

  }

});


module.exports = GroupColumnsView;
