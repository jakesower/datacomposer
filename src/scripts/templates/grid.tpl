<table>
  <thead>
    <% dataset.eachColumn( function ( colName, colObject, index ) { %>
      <th class="<%- colObject.type %>"><%- colName %></th>
    <% }) %>
  </thead>
  <tbody>
    <% dataset.each( function( row ) { %>
      <tr>
        <% dataset.eachColumn( function ( colName, colObject ) { %>
          <td class="<%- colObject.type %>"><%- colObject.toString(row[colName]) %></td>
        <% }) %>
      </tr>
    <% }) %>
  </tbody>
</table>