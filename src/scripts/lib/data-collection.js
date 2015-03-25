var _ = require('lodash'),
    Backbone = require('backbone'),
    Column = require('./column.js'),
    Utils = require('../lib/utils.js'),
    DataTypes = require('./data-types.js'),
    Facets = require('../lib/facets.js');


var filterOperators = {
  "equals": function(column, operand, dataRow) { return dataRow[column] === operand; },
  "is": function(column, operand, dataRow) { return dataRow[column] === operand; },
  "does not equal": function(column, operand, dataRow) { return dataRow[column] !== operand; },
  "is not": function(column, operand, dataRow) { return dataRow[column] !== operand; },
  "is at most": function(column, operand, dataRow) { return dataRow[column] <= operand; },
  "is at least": function(column, operand, dataRow) { return dataRow[column] >= operand; },
};



var DataCollection = function( options ) {
  var columnLookup = {};

  this.rows = options.rows;
  this.columns = options.columns;

  _.each( options.columns, function( column ){
    columnLookup[column.id] = column;
  });

  this._columnLookup = columnLookup;
};


/*
 * Contains a collection of data that responds to calls for columns and rows.
 * This object should be considered immutable and stateless.
 */
_.extend( DataCollection.prototype, Backbone.Events, {
  _cache: {},
  _columnLookup: {},


  /**
   * Creates a new filter to be applied to the collection
   *
   * @param {object} filter - raw filter data used to compose filter
   * @param {number} filter.column - ID of the column to filter
   * @param {string} filter.operator - operator to apply
   * @param {string} filter.operand - target of operator
   */
  filter: function( filter ) {
    var column = this.getColumn( filter.column ),
        operator = filter.operator,
        operand = DataTypes[column.type].coerce( filter.operand ),
        filterFunc = filterOperators[operator].bind( undefined, column.id, operand );

    return new DataCollection({
      rows: this.rows.filter( filterFunc ),
      columns: this.columns
    });
  },


  /*
   * Produce a new collection by grouping on _groupings_ then adding columns
   * based on _groupings_ and _facets_ applied to each group
   *
   * Assume that the group functions have been bound to column names.
   *
   * This could use a good refactoring.
   */
  groupTransform: function( groupings, facets ) {
    var groups,
        facetColumns,
        derivedRows = [],
        derivedColumns = [];


    groups = _.groupBy( this.rows, function( row ){
      return groupings.map( function(g) { return row[g]; } );
    });

    facetColumns = facets.map( function( facet ){
      var facetDef = Facets[facet.facet],
          facetColumns = facet.args.map( function( arg ){
            return this.columns[arg].name;
          }, this);

      return new Column({
        type: facetDef.columnType,
        name: facetDef.columnTitle( facetColumns )
      });
    }, this);

    derivedColumns = groupings.map( this.getColumn, this ).concat( facetColumns );

    derivedRows = _.values( groups ).map( function( group ) {
      var out = {};

      groupings.forEach( function( grouping ){
        out[grouping] = group[0][grouping];
      });

      facets.forEach( function( facet, idx ){
        var facetDef = Facets[facet.facet],
            facetColumn = facetColumns[idx];
        out[facetColumn.id] = facetDef.func( group, facet.args );
      }, this);

      return out;
    }, this);

    return new DataCollection({
      rows: derivedRows,
      columns: derivedColumns
    });
  },


  sort: function( sortOrder ) {
    var column = sortOrder.column,
        direction = sortOrder.direction;

    return new DataCollection({
      columns: this.columns,
      rows: _.sortByOrder( this.rows, [column], [direction === 'asc'] )
    });
  },


  getColumn: function( columnID ) {
    return this._columnLookup[columnID];
  },


  columnNames: function() {
    return _.map( this.columns, function( col ){ return col.name; } );
  }


});



// This is a singleton for now
module.exports = DataCollection;
