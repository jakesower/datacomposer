// render the skeleton of the app, then initialize components

var $            = require('jquery'),
    Backbone     = require('backbone'),
    React = require('react'),
    DataComposer = require('./datacomposer'),
    Controls = require('./views/controls.jsx'),
    Grid = require('./views/grid.jsx'),
    DCTemplate   = require ('./templates/datacomposer.tpl');


Backbone.$ = $;

// interface for the outside world
function DataComposerApp( el, options ) {
  DataComposer.initialize( options );
  this.el = el;
  this.initialize();
  this.render();
}


DataComposerApp.prototype = {
  el: null,

  initialize: function() {
    DataComposer.on( 'change', this.render );
    this.render();
  },


  render: function() {
    React.render(
      <div className="datacomposer">
        <Controls datacomposer={DataComposer} />

        <main>
          <div id="loading-messages">
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
            <div id="messages"></div>
          </div>

          <div id="grid"></div>
        </main>
      </div>,

    this.el );
  }

};


module.exports = DataComposerApp;
