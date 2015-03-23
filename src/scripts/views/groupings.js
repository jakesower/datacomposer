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
    DataComposer.on( 'change:groupings', this.render, this );
  },


  render: function( collections ) {
    this.$el.html(template({
      collection: collections.from,
      columns: collections.from.columns,
      groupings: DataComposer.groupings
    }));
  },


  addGrouping: function( e ) {
    var groupingColumn = this.$el.find( "#grouping-column" ),
        grouping = groupingColumn.val();
    
    DataComposer.addGrouping( grouping );
  },


  removeGrouping: function(e) {
    var elt = e.target,
        groupingID = elt.dataset.groupingid;

    DataComposer.removeGrouping( groupingID );
  }

});



module.exports = GroupsView;
