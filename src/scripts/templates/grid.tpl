<table>
  <thead>
    <% dataset.eachColumn( function (column) { %>
      <th class="<%- column.type %>"><%- column.name %></th>
    <% }) %>
  </thead>
  <tbody>
    <% dataset.each( function(row) { %>
      <tr>
        <% dataset.eachColumn( function (column) { %>
          <td class="<%- column.type %>"><%- column.toString(row[column.name]) %></td>
        <% }) %>
      </tr>
    <% }) %>
  </tbody>
</table>