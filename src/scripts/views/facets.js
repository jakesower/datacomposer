var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    DataComposer = require('../datacomposer.js'),
    FacetFunctions = require('../lib/facets.js'),
    template = require('../templates/controls/facets.tpl');


var FacetsView = Backbone.View.extend({
  collection: null,

  events: {
    "change #facet-name": "setArgs",
    "submit #new-facet": "createFacet",
    "click .remover": "removeFacet"
  },

  initialize: function() {
    DataComposer.on( 'change:groupings', function( collections ){
      this.collection = collections.from;
      this.render();
    }, this );
  },

  render: function() {
    this.$el.html( template( {
      facetFunctions: FacetFunctions,
      facets: DataComposer.facets
    }));
  },


  setArgs: function() {
    var columns = this.collection.columns,
        columnsByType,
        elt = this.$( "#facet-name" )[0],
        facetName = elt.options[elt.selectedIndex].value,
        args = FacetFunctions[facetName].args;

    columnsByType = _.groupBy( columns, function( column ){
      return column.type;
    });

    args.forEach( function( arg ){
      startworkhere
    });
  },


  createFacet: function(e) {
    e.preventDefault();

    var filter = {},
        formValues = this.$el.find( "#new-filter" ).serializeArray();

    _.each(formValues, function(fv) {
      filter[fv.name] = fv.value;
    });

    this.$el.find("#new-filter")[0].reset();
    DataComposer.addFilter(filter);
  },


  removeFacet: function(e) {
    var elt = e.target,
        filterId = elt.dataset.filterid;
    
    DataComposer.removeFilter(filterId);
  }

});


module.exports = FacetsView;
