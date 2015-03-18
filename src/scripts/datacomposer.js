var $                     = require('jquery'),
    _                     = require('lodash'),
    Backbone              = require('backbone'),
    DataCollection        = require('./lib/data-collection.js');



//
// Core singular class. All meaningful state should be in this module.
//

function DataComposer() { }


_.extend( DataComposer.prototype, Backbone.Events, {
  _cache: {},
  groupMode: null, // will be true/false later

  sourceList: [],
  columns: [],    // only columns to be displayed
  filters: [],
  groupings: [],


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
    collection = this.filters.reduce( function( remaining, filter ) {
      return remaining.filter( filter );
    }, collection );

    // callback
    this.trigger( 'change:filters', collection );

    // cascade
    this._applyGroupings( collection );
  },


  _applyGroupings: function( collection ) {
    var groupedCollection,
        nextAction;

    // cache
    if( collection ) {
      this._cache.grouping = collection;
    } else {
      collection = this._cache.grouping;
    }


    // calculate
    groupMode = (this.groupings.length === 0);
    // we can go one of two ways here, depending on if we're grouping or not
    if( groupMode ) {
      // no groupings--just use columns as provided
      nextAction = this._applyColumns.bind( this );
    }

    else {
      // reconstruct the collection based on groupings and group functions
      // groups are cartesian products of unique values of grouped columns
      collection = collection.groupBy( this.groupings );
      nextAction = this._applyGroupFilters.bind( this );
    }

    if (groupMode !== this.groupMode ) {
      this.columns = collection.columns;
    }

    // callback
    this.trigger( 'change:groupings', collection );

    // cascade -- branch on if we're grouping or not
    nextAction( collection );
  },


  _applyGroupFilters: function( collection ) {    
    // cache
    if( collection ) {
      this._cache.groupFilter = collection;
    } else {
      collection = this._cache.groupFilter;
    }

    // calculate
    // NOOP for now

    // callback
    this.trigger( 'change:groupFilters', collection );

    // cascade
    this._finishCascade( collection );
  },


  _applyColumns: function( collection ) {
    // cache
    if( collection ) {
      this._cache.columns = collection;
    } else {
      collection = this._cache.columns;
    }

    // calculate
    collection = new DataCollection({
      columns: this.columns,
      rows: collection.rows
    })

    // callback
    this.trigger( 'change:columns', collection );

    // cascade
    this._finishCascade( collection );
  },


  _finishCascade: function( collection ) {
    this.collection = collection;
    this.trigger('change', collection);
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


  addColumn: function( column ) {

  },


  /**
   * Creates a new filter to be applied to the universe
   *
   * @param {object} filterData - raw filter data used to compose filter
   * @param {string} filterData.column - name of the column to filter
   * @param {string} filterData.operator - operator to apply
   * @param {string} filterData.operand - target of operator
   */
  addFilter: function(filterData) {
    var filter, filterFunc,
        filterID = _.uniqueId(),
        operatorMap = {
          "equals": function(column, operand, dataRow) { return dataRow[column] === operand; },
          "is": function(column, operand, dataRow) { return dataRow[column] === operand; },
          "does not equal": function(column, operand, dataRow) { return dataRow[column] !== operand; },
          "is not": function(column, operand, dataRow) { return dataRow[column] !== operand; },
          "is at most": function(column, operand, dataRow) { return dataRow[column] <= operand; },
          "is at least": function(column, operand, dataRow) { return dataRow[column] >= operand; },
        },
        column = this.columnsByName[filterData.column],
        operator = operatorMap[filterData.operator],
        operand = DataTypes[column.type].coerce(filterData.operand);

    // we may be able to do a better job returning a pure function, rather than what lodash gives us
    filterFunc = _.curry(operator, 3)(column.name, operand);

    this.filters.push({
      filter: filterFunc,
      id: filterID,
      string: filterData.column + " " + filterData.operator + " " + filterData.operand
    });

    this._applyFilters();
  },


  removeFilter: function(filter) {
    this.filters = _.without( this.filters, filter );
    this._applyFilters();
  },


  /**
   * Adds a grouping that aggregates the data, switching DC into group mode
   *
   * @param {string} grouping - the column name to group on
   */
  addGrouping: function( grouping ) {
    this.groupings.push( grouping );
    this._applyGroupings();
  },


  removeGrouping: function( grouping ) {
    this.groupings = _.filter( this.groupings, function( g ){
      return grouping != g;
    });
    this._applyGroupings();
  },

});


module.exports = new DataComposer();
