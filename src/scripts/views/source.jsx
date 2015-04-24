var React = require('react');


var CSVField = React.createClass({
  render: function(){}
});


var SourceView = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Upload CSV</h2>
        <input id="csv" type="file" accept=".csv" />
        <br/><br/>

        <h2>Pick Predefined</h2>
        <select id="predefinedURL">
          <option value=""></option>
          {this.props.sourceList.map(function( source ) {
            return <option key="{source.id}" value="{source.id}">{source.name}</option>;
          })}
        </select>
        <button id="loadSource">Load Source</button>
      </div>
    )
  }
})



module.exports = SourceView;