<ul id="existing-filters">
<% _.each(dataset.filters, function(filter) { %>
  <li class="filter">
    <span class="text"><%- filter.string %></span>
    <span class="remover" data-filterid="<%- filter.id %>">✕</span>
  </li>
<% }); %>
</ul>
<div class="clear"></div>

<div class="separated">
  <form id="new-filter">
    <select id="column" name="column" required>
      <option class="blank" value="" default>New Filter</option>
      <% _.each(dataset.columns, function(column) { %>
        <option value="<%- column.name %>"><%- column.name %></option>
      <% }) %>
    </select>

    <select id="operator" name="operator" required>
    </select>

    <input type="text" id="operand" name="operand" required>
    
    <input type="submit" value="Add Filter">
  </form>
</div>