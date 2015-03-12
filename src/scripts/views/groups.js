var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    Dataset = require('../lib/dataset.js'),
    GroupFunctions = require('../lib/group-functions.js'),
    template = require('../templates/controls/groups.tpl');


var FiltersView = Backbone.View.extend({

  events: {
    "change #column": "setColumn",
    "submit #new-filter": "createFilter",
    "click .remover": "removeFilter"
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
    this.$el.html( template( {
      dataset: Dataset,
      groupFunctions: GroupFunctions
    }));
  },



  setColumn: function() {
    var columnName = this.$("#column").val(),
        column = Dataset.getColumn(columnName),
        filters = (column ? column.filters() : []);
    
    var operators = _.map(filters, function(f) { return this.operators[f]; }, this);
    operators = _.union(_.flatten(operators));

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