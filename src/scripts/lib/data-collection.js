var _ = require('lodash'),
    Backbone = require('backbone'),
    Column = require('./column.js'),
    Utils = require('../lib/utils.js'),
    DataTypes = require('./data-types.js');



var DataCollection = function( options ) {
  this.rows = options.rows;
  this.columns = options.columns;
};


/*
 * Contains a collection of data that responds to calls for columns and rows.
 * This object should be considered immutable and stateless.
 */
_.extend( DataCollection.prototype, Backbone.Events, {
  _cache: {},

  filter: function( filter ) {
    return new DataCollection({
      rows: this.rows.filter( filter.filter ),
      columns: this.columns
    });
  },


  /*
   * Produce a new collection by grouping on _groupings_ then adding columns
   * based on _groupings_ and _groupFunctions_ applied to each group
   *
   * Assume that the group functions have been bound to column names.
   */
  groupTransform: function( groupings, groupFunctions ) {
    var groups,
        derivedRows = [],
        derivedColumns = [];
        
    groups = _.groupBy( this.rows, function( row ){
      return groupings.map( function(g) { return row[g]; } );
    });

    derivedColumns = groupings
      .map( this.getColumn )
      .concat( groupFunctions.map( function( groupFunction ){
        new Column({
          type: groupFunction.columnType,
          name: groupFunction.name
        });
      }));

    derivedRows = groups.map( function( group ) {
      var out = {};

      groupings.forEach( function( grouping ){
        out[grouping] = group[0][grouping];
      });

      groupFunctions.forEach( function( groupFunction ){
        out[groupFunction.name] = groupFunction.func( group );
      });

      return out;
    }, this);

    return new DataCollection({
      rows: derivedRows,
      columns: derivedColumns
    });
  }




});



// This is a singleton for now
module.exports = DataCollection;
