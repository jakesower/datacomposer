<header>
  <%
  var pageRange = 2,
    showToPage = true,
    startPage, endPage;

  %><div class="num-results"><%- numResults %> result<%- (numResults === 1) ? "" : "s" %></div><%

  if( numPages > 1 ) {
    if( numPages <= ((pageRange*2) + 3) ) {
      startPage = 1; endPage = numPages;
      showToPage = false;
    }
    else {
      startPage = ( ( numPages - page ) <= pageRange ) ?
        numPages - (pageRange * 2) :
        Math.max( page - pageRange, 1 );

      endPage = ( page <= pageRange ) ?
        (pageRange * 2) + 1 :
        Math.min( page + pageRange, numPages );
    }

    if( startPage > 1 ) {
      %><button class="page" data-page="1">1</button><%
      if( startPage > 2 ) {
        %><div class="dot-divider">...</div><%
      }
    }
    for(var i=startPage;i<=endPage;++i) {
      %><button class="page<%- (i == page) ? " selected" : "" %>" data-page="<%- i %>"><%- i %></button><%
    }
    if( endPage < numPages ) {
      if( endPage < (numPages - 1) ) {
        %><div class="dot-divider">...</div><%
      }
      %><button class="page" data-page="<%- numPages %>"><%- numPages %></button><%
    }

    if( showToPage ) {
      %><input id="setPage" type="number" min="1" max="<%- numPages %>" value="<%- page %>"><button id="goToPage">Go</button><%
    }

    %><select id="perPage"><%
      [10, 20, 50, 100].forEach( function ( x ) { 
        %><option value="<%- x %>"<%- (x === perPage) ? " selected" : "" %>><%- x %> per page</option><%
      });
    %></select><%
  }

  %>
</header>

<table id="dataTable">
  <thead>
    <tr>
    <% _.each( columns, function( column ) { %>
      <% var sortClass = (sortOrder.column == column.id) ? " sorted-"+sortOrder.direction : ''; %>
      <th class="<%- column.type %><%- sortClass %>" data-columnid="<%- column.id %>">
        <%= column.name %>
        <div class="sort-arrow"></div>
      </th>
    <% }) %>
    </tr>
  </thead>

  <tbody>
    <% _.each( rows, function( row ) { %>
      <tr>
        <% _.each( columns, function( column ) { %>
          <td class="<%- column.type %>"><%= row[column.id] %></td>
        <% }); %>
      </tr>
    <% }); %>
  </tbody>

</table>
