// render the skeleton of the app, then initialize components

var dc        = require('./templates/datacomposer.hbs'),
    $         = require('jquery'),
    Accordion = require('./lib/accordion.js');

// render skeleton
$('.datacomposer').replaceWith(dc());

// initialize ui stuff
var menu = new Accordion($('#tools'));
