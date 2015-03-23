<ul class="removable-list" id="existing-filters">
<% _.each( filters, function( filter ) { %>
  <li class="filter">
    <span class="text"><%- filter.toString( collection ) %></span>
    <span class="remover" data-filterid="<%- filter.id %>">x</span>
  </li>
<% }); %>
</ul>
<div class="clear"></div>

<div class="separated">
  <form id="new-filter">
    <select id="column" name="column" required>
      <option class="blank" value="" default>New Filter</option>
      <% _.each( columns, function( column ) { %>
        <option data-type="<%- column.type %>" value="<%- column.id %>"><%- column.name %></option>
      <% }) %>
    </select>

    <select id="operator" name="operator" required>
    </select>

    <input type="text" id="operand" name="operand" required>
    
    <input type="submit" value="Add Filter">
  </form>
</div>