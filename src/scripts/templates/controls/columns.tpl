<table id="columns">
  <thead>
    <th></th>
    <th>Visible</th>
  </thead>
  <tbody>
    <% _.each( columns, function( column ) { %>
      <tr class="column" data-columnid="<%- column.id %>">
        <td><%- column.name %></td>
        <td class="input"><input type="checkbox"<%- (_.include( selectedColumns, column.id )) ? ' checked' : '' %>></td>
      </tr>
    <% }); %>
  </tbody>
</table>
