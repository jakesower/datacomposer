var _ = require('lodash'),
    GroupFunctions = require('./group-functions.js');

var GroupedDataset = function( baseSet, groupings, columnFunctions ) {
  this.baseSet = baseSet;
  this.groupings = groupings;
  this.columnFunctions = columnFunctions || [];
  this.initialize();
};


GroupedDataset.prototype = {
  baseSet: null,
  groupings: null,
  groups: null,
  columnFunctions: [],


  initialize: function() {
    // place each row into a groups based on groupings
    this.groups = _.groupBy( this.baseSet, function( row ){
      return this.groupings.map( function(g) { return row[g]; } );
    }, this);
  },


  set: function() {
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

      return out;
    });
  }

};

module.exports = GroupedDataset;
