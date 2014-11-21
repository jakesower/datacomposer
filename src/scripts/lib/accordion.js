var cssTransitions = ['background-color', 'color'];
var root = $('#tools');
var allSections = $(root).find("> section");
var activeSection = allSections[0];
var allPanels = $(root).find("> section > div");
var activePanel = allPanels[0];

var applyMaxHeight = function() {
  var totalHeight = $(root).height();
  var active = _.find($(root).children(), function(elt){
    return $(elt).hasClass('active'); 
  });

  var inactive = _.find($(root).children(), function(elt){
    return !$(elt).hasClass('active'); 
  });

  var childHeight = $(inactive).outerHeight();
  var sectionHeight = totalHeight - (($(root).children().length) * (childHeight+1));
  var innerHeightDelta = $(active).find('> div').outerHeight() - $(active).find('> div').height();

  _.each(allPanels, function(elt){
    $(elt).css("max-height", (sectionHeight - innerHeightDelta));
  });

};

$(root).find('> section').click(function(){
  if(activeSection !== this) {
    activeSection = this;
    allPanels.slideUp();
    allSections.removeClass('active');

    $(this).addClass('active');
    $(this).find('> div').slideDown();
  }
});

$(window).resize(function(){
  applyMaxHeight();
});

allPanels.hide();
$(activePanel).show();
applyMaxHeight();
$(root).show();

function Accordion(el, options) {

}


module.export = Accordion;
