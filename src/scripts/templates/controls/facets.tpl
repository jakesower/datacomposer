<ul class="removable-list" id="existing-groups">
<% _.each( facets, function( facet ) { %>
  <% var columnNames = _.map( facet.args, function(f) { return collection.getColumn( f ).name } ); %>
  <li class="grouping">
    <span class="text"><%- facet.facet %> (<%- columnNames.join(", ") %>)</span>
    <span class="remover" data-facetid="<%- facet.id %>">✕</span>
  </li>
<% }); %>
</ul>
<div class="clear"></div>

<div class="separated">
  <form id="new-facet">
    <select id="facet-name" name="facet" required>
      <option class="blank" value="" default>New Operation</option>
      <% _.each( facetFunctions, function( func ) { %>
        <option value="<%- func.name %>"><%- func.name %></option>
      <% }) %>
    </select>
      
    <div id="arguments-container"></div>
    
    <button id="add-facet">Add Operation</button>
  </form>
</div>

