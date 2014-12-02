(list of filters)
<div class="clear"></div>
<button id="new">+ New Filter</button>

<form id="new-filter">
  <select id="column">
    <option value=""></option>
    <% _.each(dataset.columns, function(column) { %>
      <option value="<%- column.name %>"><%- column.name %></option>
    <% }) %>
  </select>
  
  <div class="category" id="equality">
    Equality
  </div>

  <div class="category" id="numeric">
    Numeric

  </div>

  <div class="category" id="range">
    Range
  </div>

  <div class="category" id="enumerated">
    Enumerated

  </div>

  <div class="category" id="time">
    Time

  </div>
</form>