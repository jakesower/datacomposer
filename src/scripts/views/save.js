var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    DataComposer = require('../datacomposer.js'),
    BabyParse = require('babyparse');


var SaveView = Backbone.View.extend({
  el : 'main',
  template: require('../templates/controls/save.tpl'),
  events: {
    "click #exportCSV": "exportCSV"
  },

  initialize : function() {
    this.render();
  },

  render : function() {
    this.$el.html(this.template());
  },

  exportCSV : function() {
    var csv = BabyParse.unparse(DataComposer.set),
        blob = new Blob([csv], {type: 'text/csv'}),
        url = window.URL.createObjectURL(blob);
    location.href = url;
  }
});


module.exports = SaveView;
