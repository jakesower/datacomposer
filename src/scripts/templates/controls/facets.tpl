<ul class="removable-list" id="existing-groups">
<% _.each( facets, function( facet ) { %>
  <li class="grouping">
    <span class="text"><%- facet.name %></span>
    <span class="remover" data-facetid="<%- facet.id %>">✕</span>
  </li>
<% }); %>
</ul>
<div class="clear"></div>

<div class="separated">
  <form id="new-facet">
    <select id="facet-name" required>
      <option class="blank" value="" default>New Facet</option>
      <% _.each( facetFunctions, function( func ) { %>
        <option value="<%- func.name %>"><%- func.name %></option>
      <% }) %>
    </select>
      
    <div id="arguments-container"></div>
    
    <button id="add-facet">Add Facet</button>
  </form>
</div>

