/*
 * These are functions that can be applied to any collection of rows, reducing
 * them to a single value.  These are used in conjunction with Groups.
 *
 * Arguments:
 *   - args: array of arguments by type--see ./data_types.js
 *   - func: function that takes in a collection of rows to be reduced into a
 *           single value
 *           https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
 *   - initialValue: an optional value to be passed into func as the initial
 *                   memo value
 */


var GroupFunctions = {

  count: {
    args: [],  // doesn't matter what we get passed in
    func: function( group ) {
      return group.length;
    }
  },

  sum: {
    args: [ "number" ],
    func: function( group, args ) {
      return group.reduce( function( memo, row ){
        return memo + row[args[0]];
      });
    }
  }

};



module.exports = GroupFunctions;
