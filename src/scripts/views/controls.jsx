var Accordion  = require('../lib/accordion.js'),
    DataComposer = require('../datacomposer.js'),
    ControlTemplate = require('../templates/control.tpl'),
    React = require('react'),

    Source = require('./source.jsx');


var Section = React.createClass({
  render: function() {
    return (
      <section className="active">
        <h1>{this.props.name}</h1>
        {this.props.children}
      </section>
    )
  }
});



/**
 * Controls the sidebar columns--which are visible and which are not
 *
 */
var ControlsView = React.createClass({
  render: function() {

    return (
      <aside>
        <Section name="Source">
          <Source  sourceList={this.props.datacomposer.sourceList} />
        </Section>

      </aside>
    )
  }
});

module.exports = ControlsView;
