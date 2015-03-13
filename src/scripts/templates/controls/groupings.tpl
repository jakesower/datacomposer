<ul class="removable-list" id="existing-groups">
<% _.each( dataset.groupings, function( grouping ) { %>
  <li class="grouping">
    <span class="text"><%- grouping %></span>
    <span class="remover" data-grouping="<%- grouping %>">✕</span>
  </li>
<% }); %>
</ul>
<div class="clear"></div>

<div class="separated">
  <select id="grouping-column" required>
    <option class="blank" value="" default>New Grouping</option>
    <% _.each( dataset.columns, function( column ) { %>
      <option value="<%- column.name %>"><%- column.name %></option>
    <% }) %>
  </select>
    
  <button id="add-grouping">Add Grouping</button>
</div>

