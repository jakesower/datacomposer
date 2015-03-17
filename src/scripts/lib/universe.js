var DataCollection = require('./data-collection.js');


var Universe = function( options ) {
  this.initialize();
}


/*
 * A type of DataCollection, but it's also responsible for taking in raw data,
 * parsing it and extracting columns. Used as the basis for the system.
 */
_.extend( Universe.prototype, DataCollection.prototype, {
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
});

module.exports = Universe;
