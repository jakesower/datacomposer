<h2>Upload CSV</h2>
<input id="csv" type="file" accept=".csv">
<br><br>

<!-- <h2>Import URL</h2>
<input id="userURL" type="text"><input id="importURL" type="submit" value="Import">
<br><br>
 -->
<h2>Pick Predefined</h2>
<select id="predefinedURL">
<option value=""></option>
<% _.each(dataset.sourceList, function(source) { %>
  <option value="<%= source.id %>"><%= source.name %></option>
<% }); %>
</select>
<button id="loadSource">Load Source</button>
