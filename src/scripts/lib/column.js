var _ = require('lodash'),
    Backbone = require('backbone'),
    DataTypes = require('./data_types.js');


var Column = Backbone.Model.extend({
  defaults: {
    "used"    : true,
    "visible" : true
  },

  initialize: function(options) {
    // immutable attributes
    this.type = options.type;
    this.name = options.name;
    this.id   = _.uniqueId();

    return this;
  },

  toString: function(v) {
    return DataTypes[this.type].string(v);
  },

  coerce: function(v) {
    return DataTypes[this.type].coerce(v);
  },

  filters: function() {
    return DataTypes[this.type].filters;
  }

});



module.exports = Column;