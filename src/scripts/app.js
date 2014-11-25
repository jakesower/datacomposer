// render the skeleton of the app, then initialize components

var $         = require('jquery'),
    _         = require('lodash'),
    Accordion = require('./lib/accordion.js'),
    Backbone  = require('backbone'),
    views     = {},
    templates = {};

Backbone.$ = $;

views.source = {name: "Source", view: require('./views/source.js')};

templates.datacomposer = require('./templates/datacomposer.hbs');
templates.control = require('./templates/control.hbs');

$(function() {
  // render skeleton
  $('.datacomposer').replaceWith(templates.datacomposer());

  // initialize ui stuff
  var sidebar = $('#tools');

  // render the controls
  _.each(views, function(viewData) {
    var control = $(templates.control(viewData));
    $(sidebar).append(control);

    var viewEl = control.children()[1];
    new viewData.view({el: viewEl});
  });


  new Accordion(sidebar);
});
