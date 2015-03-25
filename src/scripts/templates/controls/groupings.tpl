<ul class="removable-list" id="existing-groups">
<% _.each( groupings, function( grouping ) { %>
  <li class="grouping">
    <span class="text"><%- grouping.string( collection ) %></span>
    <span class="remover" data-groupingid="<%- grouping.id %>">✕</span>
  </li>
<% }); %>
</ul>
<div class="clear"></div>

<div class="separated">
  <form id="grouping-form">
    <select id="grouping-column" required>
      <option class="blank" value="" default>New Grouping</option>
      <% _.each( columns, function( column ) { %>
        <option value="<%- column.id %>"><%- column.name %></option>
      <% }) %>
    </select>
      
    <input type="submit" id="add-grouping" value="Add Grouping">
  </form>
</div>

