var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Dataset = require('../lib/dataset.js'),
    template = require('../templates/controls/source.tpl'),
    BabyParse = require('babyparse');

var columnTypeDetectors = {
  boolean: /^(true|false)$/,
  number: /^\s*[\-\.]?[0-9]+([\.][0-9]+)?\s*$/,
  string: new RegExp('.*')
};

var SourceView = Backbone.View.extend({

  events: {
    "change #csv": "importCSV"
  },

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.html(template());
  },


  // generic consumer of data--imports should all end up here as JSON
  // format:
  // {
  //   columns: column objects or strings (will be auto detected)
  //   data: raw data
  // }
  importData: function(data) {
    Dataset.loadSource(data);
  },


  importCSV: function() {
    var reader = new FileReader(),
        file = $('#csv').prop('files')[0];

    if(!file) { return null; }

    reader.onload = _.bind(function() {
      this.parseCSV(reader.result);
    }, this);
    
    reader.readAsText(file);
  },


  parseCSV: function(csvData) {
    var parsed = BabyParse.parse(csvData).data,
        columns = parsed[0],
        rawData = parsed.slice(1,-1),
        data = [];

    // data is coming in as an array--transform to object
    _.each(rawData, function(row) {
      var datum = {};
      _.each(columns, function(col, idx) {
        datum[col] = row[idx];
      });
      data.push(datum);
    });

    this.importData.call(this, {
      columns: columns,
      data: data
    });
  }

});



module.exports = SourceView;