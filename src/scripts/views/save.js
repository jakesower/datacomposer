var $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    DataComposer = require('../datacomposer.js'),
    FileSaver = require('../lib/filesaver.min.js'), // pull from npm in future if possible
    BabyParse = require('babyparse');


var SaveView = Backbone.View.extend({
  collection: null,

  el : 'main',
  template: require('../templates/controls/save.tpl'),
  events: {
    "click #exportCSV": "exportCSV"
  },

  initialize: function() {
    DataComposer.on( 'change', function( collection ){
      this.collection = collection;
    }, this);
    this.render();
  },

  render: function() {
    this.$el.html( this.template() );
  },

  exportCSV : function() {
    var csv = BabyParse.unparse({
        fields: this.collection.columnNames(),
        data: _.map( this.collection.rows, _.values )
      }),
      blob = new Blob( [csv], {type: 'text/csv'} );

    FileSaver.saveAs( blob, 'datacomposer.csv' );
  }
});


module.exports = SaveView;
