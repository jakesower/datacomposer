var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    DataComposer = require('../datacomposer.js'),
    GroupFunctions = require('../lib/group-functions.js'),
    template = require('../templates/controls/group-columns.tpl');


var GroupColumnsView = Backbone.View.extend({

  events: {
    "click input": "update",
  },

  initialize: function() {
    DataComposer.on('change:groupings', this.render, this);
  },

  render: function() {
    this.$el.html( template( {
      dataset: DataComposer,
      groupFunctions: GroupFunctions
    }));
  },



  update: function(e) {

  }

});


module.exports = GroupColumnsView;
