var _ = require('lodash'),
    DataTypes = require('./data-types.js');


function Column( options ) {
  this.type  = options.type;
  this.name  = options.name;
  this.order = options.order;
  this.id    = _.uniqueId();
}


Column.prototype = {
  toString: function(v) {
    return DataTypes[this.type].string(v);
  },


  coerce: function(v) {
    return DataTypes[this.type].coerce(v);
  },


  filters: function() {
    return DataTypes[this.type].filters;
  }

};



module.exports = Column;