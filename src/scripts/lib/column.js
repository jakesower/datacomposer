var _ = require('lodash'),
    DataTypes = require('./data_types.js');

var Column = function(options) {
  _.extend(this, options);
  return this;
};


_.extend(Column.prototype, {

  toString: function(v) {
    return DataTypes[this.type].string(v);
  },

  filters: function() {
    return DataTypes[this.type].filters;
  }

});



module.exports = Column;