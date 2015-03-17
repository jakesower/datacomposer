//
// Core class. All meaningful state should be in this module.
//

var _ = require('lodash'),
    Backbone = require('backbone'),
    Column = require('./column.js'),
    Utils = require('../lib/utils.js'),
    GroupedDataCollection = require('./grouped-data-collection.js'),
    DataTypes = require('./data-types.js');



var Dataset = function( options ) {
  this.options = options;
  this.initialize();
};

_.extend( Dataset.prototype, Backbone.Events, {
  // state goes here!
  _cache: {
    source: [],
    filter: [],
    grouping: [],
    groupFilter: [],
    columns: []
  },
  options: {},
  sourceList: [],
  columns: [],
  set: [],
  columnsByName: {},
  columnsById: {},
  filters: {},
  groupings: [],


  //
  // After updates to the dataset, we cascade through different transforms in a
  // fashion to minimize the amount of work done. Each method takes in a set*,
  // caches it, performs its transforms, fires an event with the current state
  // of the set, then calls the next function in the cascade.
  //
  // *If no set is passed in as input, the contents of the cache are used.
  //
  // As a mnemonic: cache, calculate, callback, cascade
  // source -> filters -> groupings -> group filters -> columns
  //

  _applySource: function( set ) {
    // cache
    this._cache.source = set;

    // no calculations
    this.set = set;

    // callback
    this.trigger( 'change:source', set );

    // cascade
    this._applyFilters( set );
  },


  _applyFilters: function( set ) {
    // cache
    if( set ) {
      this._cache.filter = set;
    } else {
      set = this._cache.filter;
    }

    // calculate
    set = _.reduce( _.values( this.filters ), function( remaining, filter ) {
      return _.filter( remaining, filter.filter );
    }, set);
    this.set = set;

    // callback
    this.trigger( 'change:filters', set );

    // cascade
    this._applyGroupings( set );
  },


  _applyGroupings: function( set ) {
    var groupedSet,
        nextAction;

    // cache
    if( set ) {
      this._cache.grouping = set;
    } else {
      set = this._cache.grouping;
    }


    // calculate
    // we can go one of two ways here, depending on if we're grouping or not
    if( this.groupings.length === 0 ) {
      // no groupings--just use columns as provided
      set = set;
      nextAction = this._applyColumns.bind( this );
    }
    else {
      // reconstruct the set based on groupings and group functions
      // groups are cartesian products of unique values of grouped columns
      set = new GroupedDataCollection( set, this.groupings );
      nextAction = this._applyGroupFilters.bind( this );
    }

    // callback
    this.trigger( 'change:groupings', set );

    // cascade -- branch on if we're grouping or not
    nextAction( set );
  },


  _applyGroupFilters: function(set) {    
    // cache
    if(set) {
      this._cache.groupFilter = set;
    } else {
      set = this._cache.groupFilter;
    }

    // calculate
    // NOOP for now
    this.set = set;

    // callback
    this.trigger('change:groupFilters', set);

    // cascade
    this._finishCascade(set);
  },


  _applyColumns: function(set) {
    // cache
    if(set) {
      this._cache.columns = set;
    } else {
      set = this._cache.columns;
    }

    // calculate
    var cols = this.visibleColumns();
    set = _.map(set, function(datum) {
      var out = {};
      _.each(cols, function(col) {
        out[col.name] = datum[col.name];
      });
      return out;
    });
    this.set = set;

    // callback
    this.trigger('change:columns', set);

    // cascade
    this._finishCascade(set);
  },


  _finishCascade: function(set) {
    this.set = set;
    this.trigger('change', set);
  },


  // end cache, calculate, callback, cascade methods



  initialize: function() {

  },


  // expect sources to come in as { name: value, ... }
  setSourceList: function(sourceList) {
    var i = 0;
    this.sourceList = [];
    _.each(sourceList, function(value, name) {
      this.sourceList.push({
        id: i,
        name: name,
        value: value
      });
      ++i;
    }, this);
  },


  // expects an object of the form:
  //  columns: [array, of, Column, objects]
  //  data: [array, of, coerced, objects]
  loadSource: function(source) {
    var columns = source.columns,
        data = source.data;

    this.columnsByName = {};
    this.columnsById = {};
    _.each(columns, function(column) {
      this.columnsByName[column.name] = column;
      this.columnsById[column.id] = column;

      // set up listeners on columns to be propogated via Dataset
      column.on('change', function() { this._applyColumns(); }, this);
    }, this);

    this.columns = columns;
    this._applySource(data);
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

    this.filters[filterID] = {
      filter: filterFunc,
      id: filterID,
      string: filterData.column + " " + filterData.operator + " " + filterData.operand
    };

    this._applyFilters();
  },


  removeFilter: function(filterId) {
    delete this.filters[filterId];
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



  applyFilters: function(set) {
    return _.reduce(_.values(this.filters), function(remaining, filter) {
      return _.filter(remaining, filter.filter);
    }, set);
  },


  // just pass along any events
  columnEvent: function(event, column) {
    this.trigger("column:change", column);
  },


  visibleColumns: function() {
    return _.filter(this.columns, function(c){return c.get("visible");});
  },


  each: function(func) {
    _.each(this.set, func);
  },

  eachColumn: function(func) {
    _.each(this.columns, func);
  },

  eachVisibleColumn: function(func) {
    var visible = _.filter(this.columns, function(c){return c.get("visible");});
    _.each(visible, func);
  },

  getColumn: function(name) {
    return this.columnsByName[name];
  },

  rowCount: function() {
    return this.set.length;
  }


});



// This is a singleton for now
module.exports = new Dataset();