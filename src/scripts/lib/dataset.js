var _ = require('lodash'),
    Backbone = require('backbone'),
    Column = require('./column.js'),
    DataTypes = require('./data_types.js');


// preference order for data types in order of strictest to more lenient
var dataTypeOrder = ['boolean', 'number', 'currency', 'time', 'string'];

var Dataset = function(options) {
  this.options = options;
  this.initialize();
};

_.extend(Dataset.prototype, Backbone.Events, {
  _cache: {
    source: [],
    filter: [],
    group: [],
    groupFilter: [],
    columns: []
  },
  options: {},
  columns: [],
  set: [],
  columnsByName: {},
  columnsById: {},
  filters: {},


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

  _applySource: function(set) {
    // cache
    this._cache.source = set;

    // no calculations
    this.set = set;

    // callback
    this.trigger('change:source', set);

    // cascade
    this._applyFilters(set);
  },


  _applyFilters: function(set) {
    // cache
    if(set) {
      this._cache.filter = set;
    } else {
      set = this._cache.filter;
    }

    // calculate
    set = _.reduce(_.values(this.filters), function(remaining, filter) {
      return _.filter(remaining, filter.filter);
    }, set);
    this.set = set;

    // callback
    this.trigger('change:filters', set);

    // cascade
    this._applyGroupings(set);
  },


  _applyGroupings: function(set) {
    // cache
    if(set) {
      this._cache.grouping = set;
    } else {
      set = this._cache.grouping;
    }

    // calculate
    // NOOP for now
    this.set = set;

    // callback
    this.trigger('change:groupings', set);

    // cascade
    this._applyGroupFilters(set);    
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
    this._applyColumns(set);    
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
    this.trigger('change', set);
  },


  // end cache, calculate, callback, cascade methods

  /**
   * Adds a type to columns
   *
   * @param {array} columns - Array of columns
   * @param {object} sample - A few rows of data to detect the type from
   */
  _detectDataTypes: function(columns, sample) {
    return _.map(columns, function(column) {
      var types, sampleRow = _.pluck(sample, column.name);

      types = _.map(sampleRow, function(sampleVal) {
        return _.find(dataTypeOrder, function(type) {
          return DataTypes[type].test(sampleVal);
        });
      });

      // console.log(DataTypes)
      if(_.every(types, function(x){ return x === types[0]; })) {
        // all the data types are the same; run with it
        column.type = types[0];
      } else {
        column.type = 'string';
      }
      return column;
    });
  },


  initialize: function() {

  },


  loadSource: function(source) {
    var columns = source.columns,
        data = source.data;

    // create column names if we're only given strings
    if(typeof columns[0] === 'string') {
      columns = _.map(columns, function(c) { return {name: c}; });
    }

    // check to see if we need to autodetect column types
    if(!_.has(columns[0], 'type')) {
      columns = this._detectDataTypes(columns, data.slice(1, 6));
    }

    // we're now assured of the minimum info needed for proper columns
    columns = _.map(columns, function(column) {
      column.id = _.uniqueId();
      return new Column(column);
    });

    this.columnsByName = {};
    _.each(columns, function(column) {
      this.columnsByName[column.name] = column;
      this.columnsById[column.id] = column;
    }, this);

    // set up listeners on columns to be propogated via Dataset
    _.each(columns, function(column) {
      column.on('change', function() { this._applyColumns(); }, this);
    }, this);

    // run our data through the column types to force uniformity
    data = _.map(data, function(datum) {
      var out = {};
      _.each(columns, function(column) {
        out[column.name] = column.coerce(datum[column.name]);
      });
      return out;
    });

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