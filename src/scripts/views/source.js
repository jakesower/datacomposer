var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Dataset = require('../lib/dataset.js'),
    template = require('../templates/controls/source.hbs');

var SourceView = Backbone.View.extend({

  events: {
    "change #csv": "importCSV"
  },

  initialize: function() {
    this.render();
  },

  render: function() {
    console.log(this.$el);
    this.$el.html(template());
  },


  importCSV: function() {
    console.log(this);
  }

});



module.exports = SourceView;