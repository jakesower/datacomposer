<header>
  Hi
</header>

<table id="dataTable">
  <thead>
    <tr>
    <% _.each( columns, function( column ) { %>
      <th><%= column %></th>
    <% }) %>
    </tr>
  </thead>

  <tbody>
    <% _.each( rows, function( row ) { %>
      <tr>
        <% _.each( columns, function( column ) { %>
          <td><%= row[column] %></td>
        <% }); %>
      </tr>
    <% }); %>
  </tbody>

</table>
