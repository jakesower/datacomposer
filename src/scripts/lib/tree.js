//*****************************************************************************
// Tree view
//*****************************************************************************

var $ = require('jquery'),
    _ = require('lodash');

/**
* Tree menu takes a DOM element of nested ul/li tags and creates a treeview
*/
function Tree(el, data) {
  this.el = el;

  this.initialize();
  this.bind();
}


Tree.prototype = {
  el : null,

  initialize : function() {
    $(this.el).addClass('tree');
    $(this.el).empty();
    // this.addNodes(this.el, this.data);
  },


  bind : function() {
    $(this.el).find('li.expandable').on('click', '>', function() {
      this.toggleClass('active');
    });
  }
};


module.exports = Tree;
