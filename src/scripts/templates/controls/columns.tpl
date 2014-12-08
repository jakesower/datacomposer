<table id="columns">
  <thead>
    <th></th>
    <!-- <th>Used</th> -->
    <th>Visible</th>
  </thead>
  <tbody>
    <% _.each(dataset.columns, function(column) { %>
      <tr class="column">
        <td><%- column.name %></td>
        <!-- <td class="input"><input type="checkbox" data-columnid="<%- column.id %>" data-field="used"<%- column.get("used") ? ' checked' : ''%>></td> -->
        <td class="input"><input type="checkbox" data-columnid="<%- column.id %>" data-field="visible"<%- column.get("visible") ? ' checked' : ''%>></td>
      </tr>
    <% }); %>
  </tbody>
</table>
