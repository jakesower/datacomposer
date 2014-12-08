var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Dataset = require('../lib/dataset.js'),
    template = require('../templates/controls/filters.tpl');


var FiltersView = Backbone.View.extend({

  events: {
    "change #column": "setColumn",
    "submit #new-filter": "createFilter",
    "click .remover": "removeFilter"
  },

  operators: {
    // equality: ['=', '≠'],
    // numeric: ['=', '≠', '<', '≤', '≥', '>']
    equality: ['is', 'is not'],
    numeric: ['equals', 'does not equal', 'is at most', 'is at least']
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
  },



  setColumn: function() {
    var columnName = this.$("#column").val(),
        column = Dataset.getColumn(columnName),
        filters = (column ? column.filters() : null);
    
    var operators = this.operators[filters];

    this.$("select#operator").empty();
    _.each(operators, function(operator) {
      this.$("select#operator").append(
        $("<option/>").val(operator).html(operator)
      );
    });
  },


  createFilter: function(e) {
    e.preventDefault();

    var filter = {},
        formValues = this.$el.find("#new-filter").serializeArray();

    _.each(formValues, function(fv) {
      filter[fv.name] = fv.value;
    });
    
    this.$el.find("#new-filter")[0].reset();
    Dataset.addFilter(filter);
  },


  removeFilter: function(e) {
    var elt = e.target,
        filterId = elt.dataset.filterid;
    
    Dataset.removeFilter(filterId);
  }

});



module.exports = FiltersView;