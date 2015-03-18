var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    DataComposer = require('../datacomposer.js'),
    template = require('../templates/controls/groupings.tpl');


var GroupsView = Backbone.View.extend({

  events: {
    "click #add-grouping": "addGrouping",
    "click .remover": "removeGrouping"
  },


  initialize: function() {
    DataComposer.on('change:source', function(set) {
      this.dataset = set;
      this.render();
    }, this);

    this.render();
  },


  render: function() {
    this.$el.html( template( {
      dataset: DataComposer
    }));
  },


  addGrouping: function( e ) {
    var groupingColumn = this.$el.find( "#grouping-column" ),
        grouping = groupingColumn.val();
    
    DataComposer.addGrouping( grouping );
    this.render();
  },


  removeGrouping: function(e) {
    var elt = e.target,
        grouping = elt.dataset.grouping;
    
    DataComposer.removeGrouping(grouping);
    this.render();
  }

});



module.exports = GroupsView;
