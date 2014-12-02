var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Dataset = require('../lib/dataset.js'),
    template = require('../templates/controls/filters.tpl');


var FiltersView = Backbone.View.extend({

  events: {
    "change #column": "setColumn"
  },

  operators: {
    equality: ['=', '≠'],
    numeric: ['=', '≠', '<', '≤', '≥', '>']
  },

  initialize: function() {
    Dataset.on('change', function(set) {
      this.dataset = set;
      this.render();
    }, this);

    this.render();
  },

  render: function() {
    this.$el.html(template({dataset: Dataset}));
    // this.$(".category").each(function(idx, cat) { $(cat).hide(); });
  },



  setColumn: function() {
    var columnName = this.$("#column").val(),
        column = Dataset.getColumn(columnName),
        filters = (column ? column.filters() : []);
    
    var operators = _.map(filters, function(f) { return this.operators[f]; }, this);
    operators = _.union(_.flatten(operators));

    console.log(operators);

    this.$(".category").each(function(idx, cat) {
      $(cat).html(operators.join(", "));
      // if(_.contains(filters, $(cat).attr("id"))) {
      //   $(cat).show();
      // } else {
      //   $(cat).hide();
      // }
    });
  }

});



module.exports = FiltersView;