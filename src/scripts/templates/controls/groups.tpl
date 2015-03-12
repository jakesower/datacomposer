<ul id="existing-groups">
<% _.each(dataset.groups, function( group ) { %>
  <li class="group">
    <span class="text"><%- group %></span>
    <span class="remover" data-groupid="<%- group %>">✕</span>
  </li>
<% }); %>
</ul>
<div class="clear"></div>

<div class="separated">
  <form id="new-group">
    <select id="column" name="column" required>
      <option class="blank" value="" default>New Group</option>
      <% _.each(dataset.columns, function(column) { %>
        <option value="<%- column.name %>"><%- column.name %></option>
      <% }) %>
    </select>
    
    <input type="submit" value="Add Group">
  </form>
</div>

<div class="separated">
  Hi
</div>

