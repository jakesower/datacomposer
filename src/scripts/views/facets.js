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
      facets: DataComposer.facets,
      collection: this.collection
    }));
  },


  setArgs: function() {
    var columns = this.collection.columns,
        columnsByType,
        elt = this.$( "#facet-name" )[0],
        facetName = elt.options[elt.selectedIndex].value,
        facetFunc = FacetFunctions[facetName],
        args = (facetFunc) ? facetFunc.args : [],
        argsContainer = this.$( "#arguments-container" );

    columnsByType = _.groupBy( columns, function( column ){
      return column.type;
    });

    argsContainer.empty();
    _.each( args, function( arg, idx ){
      var select = document.createElement( "select" );
      select.required = true;
      select.setAttribute( "name", "argument" );

      var blankOption = new Option( "("+arg+")", "" );
      select.appendChild( blankOption );

      _.each( columnsByType[arg], function( column ){
        var option = new Option( column.name, column.id );
        select.appendChild( option );
      });

      argsContainer[0].appendChild( select );
    });

  },


  createFacet: function(e) {
    e.preventDefault();

    var facet = {},
        args = [],
        formValues = this.$el.find( "#new-facet" ).serializeArray();

    this.$( "#arguments-container" ).empty();
    this.$( "#new-facet" )[0].reset();
 
    _.each( formValues, function( fv ) {
      if( fv.name === "argument" ) {
        args.push( fv.value );
      }
      else {
        facet[fv.name] = fv.value;
      }
    });
    facet.args = args;

    DataComposer.addFacet( facet );
  },


  removeFacet: function(e) {
    var elt = e.target,
        facetId = elt.dataset.facetid;
    
    DataComposer.removeFacet(facetId);
  }

});


module.exports = FacetsView;
