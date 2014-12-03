var _ = require('lodash'),
    Backbone = require('backbone'),
    Column = require('./column.js'),
    DataTypes = require('./data_types.js');


// preference order for data types in order of strictest to more lenient
var dataTypeOrder = ['boolean', 'number', 'currency', 'time', 'string'];

var Dataset = function() {};

_.extend(Dataset.prototype, Backbone.Events, {
  universe: [],
  columns: [],
  set: [],
  columnsByName: {},
  filters: {},


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
      return new Column(column);
    });


    this.columnsByName = {};
    _.each(columns, function(column) {
      this.columnsByName[column.name] = column;
    }, this);


    this.columns = columns;
    this.universe = data;

    this.recalculate();
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
          "=": function(column, operand, dataRow) { return dataRow[column] === operand; },
          "≠": function(column, operand, dataRow) { return dataRow[column] !== operand; },
          "<": function(column, operand, dataRow) { return dataRow[column] < operand; },
          "≤": function(column, operand, dataRow) { return dataRow[column] <= operand; },
          "≥": function(column, operand, dataRow) { return dataRow[column] >= operand; },
          ">": function(column, operand, dataRow) { return dataRow[column] > operand; }
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

    this.recalculate();
  },


  removeFilter: function(filterId) {
    delete this.filters[filterId];
    this.recalculate();
  },


  // this method BEGS for optimization
  recalculate: function() {
    var set = this.universe;

    set = this.applyFilters(set);

    this.set = set;
    this.trigger("change", this);
  },


  applyFilters: function(set) {
    return _.reduce(_.values(this.filters), function(remaining, filter) {
      return _.filter(remaining, filter.filter);
    }, set);
  },


  each: function(func) {
    _.each(this.set, func);
  },

  eachColumn: function(func) {
    _.each(this.columns, func);
  },

  getColumn: function(name) {
    return this.columnsByName[name];
  }


});



// This is a singleton for now
module.exports = new Dataset();