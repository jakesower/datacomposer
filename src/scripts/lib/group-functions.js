/*
 * These are functions that can be applied to any collection of rows, reducing
 * them to a single value.  These are used in conjunction with Groups.
 *
 * Arguments:
 *   - args: array of arguments by type--see ./data_types.js
 *   - func: reducing function, for arguments, see description of callback
 *           function: (previousValue, currentValue, index, array)
 *           https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
 *   - initialValue: an optional value to be passed into func as the initial
 *                   memo value
 */


var GroupFunctions = {

  count: {
    args: [],  // doesn't matter what we get passed in
    func: function( memo, n ) {
      return memo + 1;
    }
  }

};



module.exports = GroupFunctions;
