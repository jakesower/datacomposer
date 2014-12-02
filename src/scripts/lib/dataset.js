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


  recalculate: function() {
    this.set = this.universe;
    this.trigger("change", this);
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