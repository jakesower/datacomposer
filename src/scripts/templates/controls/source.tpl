<select id="source">
<option value=""></option>
<% _.each(dataset.sourceList, function(source) { %>
  <option value="<%= source.id %>"><%= source.name %></option>
<% }); %>
</select>
<button id="loadSource">Load Source</button>
<br><br>
Upload CSV: <input id="csv" type="file" accept=".csv">