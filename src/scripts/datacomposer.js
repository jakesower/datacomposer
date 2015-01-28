// render the skeleton of the app, then initialize components

var $         = require('jquery'),
    _         = require('lodash'),
    Accordion = require('./lib/accordion.js'),
    Backbone  = require('backbone'),
    Grid      = require('./views/grid.js'),
    Dataset   = require('./lib/dataset.js'),
    Importer  = require('./lib/importer.js'),
    views     = {},
    templates = {};

views = {
  source: {name: "Source", view: require('./views/source.js')},
  columns: {name: 'Columns', view: require('./views/columns.js')},
  filters: {name: "Filters", view: require('./views/filters.js')},
  save: {name: "Save", view: require('./views/save.js')}
};

templates.datacomposer = require('./templates/datacomposer.tpl');
templates.control = require('./templates/control.tpl');


function DataComposer(el, options) {
  this.el = el;
  this.options = options;
  Dataset.setSourceList(options.sources || {});
  this.render();
  if( _.has(options, "initialSource") ) {
    Importer.import(options.initialSource).then( Dataset.loadSource.bind(Dataset) );
  }
}


DataComposer.prototype = {
  el: null,
  options: {},

  render: function() {
    $(this.el).addClass("datacomposer").empty().append(templates.datacomposer());
    var sidebar = $(this.el).find('aside#tools');

    // render the controls
    _.each(views, function(viewData) {
      var control = $(templates.control(viewData));
      $(sidebar).append(control);

      var viewEl = control.children()[1];
      new viewData.view({el: viewEl});
    });

    // render the grid
    new Grid();
    new Accordion(sidebar);
  }
};


module.exports = DataComposer;