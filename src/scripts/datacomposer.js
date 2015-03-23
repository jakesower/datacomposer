var $                     = require('jquery'),
    _                     = require('lodash'),
    Backbone              = require('backbone'),
    DataCollection        = require('./lib/data-collection.js'),
    Facets = require("./lib/facets.js");



//
// Core singular class. All meaningful state should be in this module.
//

function DataComposer() { }


_.extend( DataComposer.prototype, Backbone.Events, {
  _cache: {},
  groupMode: null, // will be true/false later

  sourceList: [],
  columns: [],    // only columnIDs to be displayed
  filters: {},
  groupings: {},
  facets: {},


  initialize: function( options ) {
    this.setSourceList( options.sources || {} );
  },


  //
  // After updates to the state, we cascade through different transforms in a
  // fashion to minimize the amount of work done. Each method takes in a collection*,
  // caches it, performs its transforms, fires an event with the current state
  // of the collection, then calls the next function in the cascade.
  //
  // *If no collection is passed in as input, the contents of the cache are used.
  //
  // As a mnemonic: cache, calculate, callback, cascade
  // source -> filters -> groupings -> group filters -> columns
  //

  _applySource: function( collection ) {
    // cache
    this._cache.source = collection;
    this.columns = collection.columns;

    // callback
    this.trigger( 'change:source', collection );

    // cascade
    this._applyFilters( collection );
  },


  _applyFilters: function( collection ) {
    // cache
    if( collection ) {
      this._cache.filter = collection;
    } else {
      collection = this._cache.filter;
    }

    // calculate
    collection = _.reduce( this.filters, function( remaining, filter ) {
      return remaining.filter( filter );
    }, collection );

    // callback
    this.trigger( 'change:filters', collection );

    // cascade
    this._applyGroupings( collection );
  },


  _applyGroupings: function( collection ) {
    var newCollection,
        groupedCollection,
        nextAction;

    // cache
    if( collection ) {
      this._cache.grouping = collection;
    } else {
      collection = this._cache.grouping;
    }


    // calculate
    groupMode = (Object.keys(this.groupings).length > 0);
    // we can go one of two ways here, depending on if we're grouping or not
    if( groupMode ) {
      // reconstruct the collection based on groupings and group functions
      // groups are cartesian products of unique values of grouped columns
      newCollection = collection.groupTransform( _.map( this.groupings, function(g){ return g.column; } ), [Facets.count] );
      nextAction = this._applyGroupFilters.bind( this );
    }

    else {
      // no groupings--just use columns as provided
      newCollection = collection;
      nextAction = this._applyColumns.bind( this );
    }

    if (groupMode !== this.groupMode ) {
      this.columns = _.pluck( collection.columns, 'id' );
    }

    // callback
    this.trigger( 'change:groupings', {
      from: collection,
      to: newCollection
    } );

    // cascade -- branch on if we're grouping or not
    nextAction( newCollection );
  },


  _applyGroupFilters: function( collection ) {    
    var newCollection;

    // cache
    if( collection ) {
      this._cache.groupFilter = collection;
    } else {
      collection = this._cache.groupFilter;
    }

    // calculate
    newCollection = collection;

    // callback
    this.trigger( 'change:groupFilters', {
      from: collection,
      to: newCollection
    } );

    // cascade
    this._finishCascade( newCollection );
  },


  _applyColumns: function( collection ) {
    // cache
    if( collection ) {
      this._cache.columns = collection;
    } else {
      collection = this._cache.columns;
    }

    // calculate
    newCollection = new DataCollection({
      columns: _.pick( collection.columns, this.columns ),
      rows: collection.rows
    });

    // callback
    this.trigger( 'change:columns', {
      from: collection,
      to: newCollection
     });

    // cascade
    this._finishCascade( newCollection );
  },


  _finishCascade: function( collection ) {
    this.collection = collection;
    this.trigger( 'change', collection );
  },

  // end cache, calculate, callback, cascade methods


  setSourceList: function(sourceList) {
    var i = 0;
    this.sourceList = [];
    _.each( sourceList, function( value, name ) {
      this.sourceList.push({
        id: i,
        name: name,
        value: value
      });
      ++i;
    }, this);
  },


  loadSource: function( source ) {
    this._applySource( source );
  },


  addColumn: function( columnID ) {
    this.columns.push( columnID );
    this._applyColumns();
  },


  removeColumn: function( columnID ) {
    this.columns = _.without( this.columns, columnID );
    this._applyColumns();
  },


  /**
   * Creates a new filter to be applied to the universe
   *
   * @param {object} filterData - raw filter data used to compose filter
   * @param {number} filterData.column - ID of the column to filter
   * @param {string} filterData.operator - operator to apply
   * @param {string} filterData.operand - target of operator
   */
  addFilter: function( filterData ) {
    var filterID = _.uniqueId(),
        string = function( collection ){
          return collection.getColumn( this.column ).name + " " + this.operator + " " + this.operand;
        };

    this.filters[filterID] = _.extend( filterData, {
      id: filterID,
      string: string
    });

    this._applyFilters();
  },


  removeFilter: function( filterID ) {
    delete this.filters[filterID];
    this._applyFilters();
  },


  /**
   * Adds a grouping that aggregates the data, switching DC into group mode
   *
   * @param {string} grouping - the column name to group on
   */
  addGrouping: function( grouping ) {
    var groupingID = _.uniqueId(),
        string = function( collection ){
          return collection.getColumn( this.column ).name;
        };

    this.groupings[groupingID] = {
      column: grouping,
      id: groupingID,
      string: string
    };
    this._applyGroupings();
  },


  removeGrouping: function( groupingID ) {
    delete this.groupings[groupingID];
    this._applyGroupings();
  },


  addFacet: function( facetName, args ) {
    var facetID = _.uniqueId(),
        facet = Facets[facetName];

    this.facets[facetID] = {
      facet: facet,
      id: facetID,
      name: facetName,
      args: args
    };
    this._applyGroupings();
  },


  removeFacet: function( facetID ) {
    delete this.facets[facetID];
    this._applyGroupings();
  },
});


module.exports = new DataComposer();
