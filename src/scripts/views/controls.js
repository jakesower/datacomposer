var $ = require('jquery'),
    _ = require('lodash'),
    Accordion  = require('../lib/accordion.js'),
    Backbone = require('backbone'),
    DataComposer = require('../datacomposer.js'),
    ControlTemplate = require('../templates/control.tpl'),

    Views = {
      source: {name: "Source", view: require('./source.js')},
      filters: {name: "Filters", view: require('./filters.js')},
      groupings: {name: "Groupings", view: require('./groupings.js')},
      columns: {name: 'Columns', view: require('./columns.js')},
      facets: {name: "▸ Group Operations", view: require('./facets.js')},
      save: {name: "Save", view: require('./save.js')}
    };


/**
 * Controls the sidebar columns--which are visible and which are not
 *
 */
var ControlsView = Backbone.View.extend({
  controls: {},
  accordion: null,

  // render everything--let render() show/hide things as needed
  initialize: function() {
    DataComposer.on( 'change', this.render, this);

    _.each( Views, function( viewData, viewName ) {
      // create the control
      var control = $( ControlTemplate( viewData ));
      this.$el.append( control );

      // render the control's view
      new viewData.view({
        el: $(control).find( '#view' )
      });

      // keep tabs on it so we can show/hide later
      this.controls[ viewName ] = control;
    }, this);

    this.render();
  },


  render: function( collection ) {
    var controls = this.controls,
        visible = [];

    _.each( controls, function( c ) {
      $(c).hide();
    });

    // always show source
    controls.source.show();

    if( collection && collection.rows.length > 0 ) {
      controls.filters.show();
      controls.groupings.show();

      if( _.size( DataComposer.groupings ) === 0 ) {
        controls.columns.show();
      }
      else {
        controls.facets.show();
      }

      controls.save.show();
    }

    if( this.accordion ) {
      var activeSection = this.accordion.activeSection;
      this.accordion = new Accordion( this.el, {activeSection: activeSection} );
    }
    else {
      this.accordion = new Accordion( this.el );
    }
  }

});

module.exports = ControlsView;
