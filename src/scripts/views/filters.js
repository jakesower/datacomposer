var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    DataComposer = require('../datacomposer.js'),
    DataTypes = require('../lib/data-types.js'),
    template = require('../templates/controls/filters.tpl');


var FiltersView = Backbone.View.extend({
  collection: null,

  events: {
    "change #column": "setColumn",
    "submit #new-filter": "createFilter",
    "click .remover": "removeFilter"
  },

  operators: {
    // equality: ['=', '≠'],
    // numeric: ['=', '≠', '<', '≤', '≥', '>']
    equality: ['is', 'is not'],
    numeric: ['equals', 'does not equal', 'is at most', 'is at least']
  },

  initialize: function() {
    DataComposer.on( 'change:filters', this.render, this);
  },

  render: function( collection ) {
    this.$el.html( template({
      collection: collection,
      columns: collection.columns,
      filters: DataComposer.filters
    }));
  },



  setColumn: function() {
    var elt = this.$( "#column" )[0],
        option = elt.options[elt.selectedIndex],
        filterType = option.dataset.type,
        operators = this.operators[ DataTypes[filterType].filters ];

    this.$( "select#operator" ).empty();

    _.each( operators, function( operator ) {
      this.$( "select#operator" ).append(
        $( "<option/>" ).val( operator ).html( operator )
      );
    }, this);
  },


  createFilter: function(e) {
    e.preventDefault();

    var filter = {},
        formValues = this.$el.find( "#new-filter" ).serializeArray();

    _.each(formValues, function(fv) {
      filter[fv.name] = fv.value;
    });

    this.$el.find("#new-filter")[0].reset();
    DataComposer.addFilter(filter);
  },


  removeFilter: function(e) {
    var elt = e.target,
        filterId = elt.dataset.filterid;
    
    DataComposer.removeFilter(filterId);
  }

});



module.exports = FiltersView;