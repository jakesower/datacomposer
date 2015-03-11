<header>
  <%
  var pageRange = 2,
    showToPage = true,
    startPage, endPage;

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
      %><input id="setPage" type="number" min="1" max="<%- numPages %>"><button id="goToPage">Go</button><%
    }

  }

  %>
</header>

<table id="dataTable">
  <thead>
    <tr>
    <% _.each( columns, function( column ) { %>
      <th><%= column %></th>
    <% }) %>
    </tr>
  </thead>

  <tbody>
    <% _.each( rows, function( row ) { %>
      <tr>
        <% _.each( columns, function( column ) { %>
          <td><%= row[column] %></td>
        <% }); %>
      </tr>
    <% }); %>
  </tbody>

</table>
