//*****************************************************************************
// Accordion menu
//*****************************************************************************

var $ = require('jquery'),
    _ = require('lodash');

/**
* Accordion menu takes an element and makes an accordion with its children.
* Children should follow the pattern of:
*
* <div>
*   <h1>Heading</h1>
*   <div>Contents</div>
* </div>
*
* Note that the elements need not be divs or h1 tags--anything tags will work
* so long as they follow that nesting pattern.
*/
function Accordion(el) {
  this.el = el;
  this.initialize();
  this.bind();
}


Accordion.prototype = {
  el            : null,
  activeSection : null,
  panelSelector : ':nth-child(2)',


  initialize : function() {
    _.each($(this.el).find('>'), function(e) {
      $(e).find(this.panelSelector).hide();
      this.showSection(e, false);
    }, this);
    this.applyMaxHeight();
    this.activateSection($(this.el).find('>')[0]);
  },


  applyMaxHeight : function() {
    var usedSpace, availableSpace, innerHeight,
        sections = $(this.el).find('>');
        sample = $(sections[0]).find(this.panelSelector);

    if(this.activeSection) {
      $(this.activeSection).hide();
    }

    usedSpace = _.reduce(sections, function(sum, section){ return sum + $(section).outerHeight(); }, 0);
    availableSpace = $(this.el).height() - usedSpace - 5;

    sample.show();
    innerHeight = sample.outerHeight() - sample.height();
    sample.hide();

    _.each($(this.el).find('>').find(this.panelSelector), function(panel) {
      $(panel).css("max-height", (availableSpace - innerHeight));
    });

    if(this.activeSection) {
      $(this.activeSection).show();
    }

  },


  activateSection : function(section) {
    if(this.activeSection === section) {
      return;
    }
 
    if(this.activeSection) {
      this.showSection($(this.activeSection), false);
    }

    this.activeSection = section;
    this.showSection(section, true);
  },


  showSection : function(section, visible) {
    var panel = $(section).find(this.panelSelector);

    if(visible) {
      panel.slideDown();
      $(section).addClass('active');
    } else {
      panel.slideUp();
      $(section).removeClass('active');
    }
  },


  bind : function() {
    var that = this;

    $(this.el).on('click', '>', function() {
      that.activateSection(this);
    });

    $(window).on('resize', this.applyMaxHeight, this);
  }
};


module.exports = Accordion;
