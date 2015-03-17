var _ = require('lodash'),
    GroupFunctions = require('./group-functions.js');

var GroupedDataCollection = function( baseCollection, groupings, columnFunctions ) {
  this.baseCollection = baseCollection;
  this.groupings = groupings;
  this.columnFunctions = columnFunctions || [];
  this.initialize();
};


_.extend( GroupedDataCollection.prototype, DataCollection.prototype, {  
  baseCollection: null,
  groupings: null,
  groups: null,

  rowsCache: null,
  columnsCache: null,

  columnFunctions: [],


  initialize: function() {
    // place each row into a groups based on groupings
    this.groups = _.groupBy( this.baseCollection, function( row ){
      return this.groupings.map( function(g) { return row[g]; } );
    }, this);
  },


  columns: function() {
    var out = [];

    if( this.columnsCache ) {
      return this.columnsCache;
    }
    
    this.groupings.forEach( function( grouping ) {
      out.push( group[0][grouping] );
    });

    return out;
  },


  rows: function() {
    if( this.rowsCache ) {
      return this.rowsCache;
    }

    // composed of two things: grouping values and functionals
    return this.groups.map( function( group ) {
      var out = [];

      // extract groupings from group
      this.groupings.forEach( function( grouping ) {
        out.push( group[0][grouping] );
      });

      // apply column functions -- column functions are composed of a
      // GroupFunction as well as column names to be used as arguments in the
      // function
      this.columnFunctions.forEach( function( columnFunction ){
        var funcName = columnFunction.name,
            args = columnFunction.args;

        out.push( GroupFunctions[ funcName ].func( group, args ) );
      });

      this.rowsCache = out;
      return out;
    });
  }

};

module.exports = GroupedDataCollection;
