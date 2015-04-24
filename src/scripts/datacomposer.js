var _ = require('lodash'),
    DataCollection = require('./lib/data-collection.js'),
    Store = require("./lib/store.js");


// Hold as much as possible in private scope
var eventRegistry = {},
    dcCache = {},

    groupMode = null,
    sortOrder = {}; // column, direction (asc/desc)


//
// Core singular class. All meaningful state should be in this module.
//
DataComposer = {
  columnsStore: new Store(),
  filtersStore: new Store(),
  groupingStores: new Store(),
  groupOperationsStore: new Store(),

  initialize: function( options ) {
    this.setSourceList( options.sources || {} );
  },


  //
  // After updates to the state, we cascade through different transforms in a
  // fashion to minimize the amount of work done. Each method takes in a collection*,
  // caches it, performs its transforms, fires an event with the current state
  // of the collection, then calls the next function in the cascade.
  //
  // *If no collection is passed in as input, the contents of the cache are used.
  //
  // As a mnemonic: cache, calculate, callback, cascade
  // source -> filters -> groupings -> group filters -> columns
  //

  _applySource: function( collection ) {
    // cache
    dcCache.source = collection;
    columns = collection.columns;

    // callback
    this.trigger( 'change:source', collection );

    // cascade
    this._applyFilters( collection );
  },


  _applyFilters: function( collection ) {
    // cache
    if( collection ) {
      dcCache.filter = collection;
    } else {
      collection = dcCache.filter;
    }

    // calculate
    collection = _.reduce( filtersStore, function( remaining, filter ) {
      return remaining.filter( filter );
    }, collection );

    // callback
    this.trigger( 'change:filters', collection );

    // cascade
    this._applyGroupings( collection );
  },


  _applyGroupings: function( collection ) {
    var newCollection,
        groupedCollection,
        nextAction;

    // cache
    if( collection ) {
      dcCache.grouping = collection;
    } else {
      collection = dcCache.grouping;
    }


    // calculate
    groupMode = (Object.keys(this.groupings).length > 0);
    // we can go one of two ways here, depending on if we're grouping or not
    if( groupMode ) {
      // reconstruct the collection based on groupings and group functions
      // groups are cartesian products of unique values of grouped columns
      newCollection = collection.groupTransform(
        _.map( groupings, function(g) {
          return g.column;
        }),
        _.values( groupOperations )
      );
      nextAction = this._applyGroupFilters.bind( this );
    }

    else {
      // no groupings--just use columns as provided
      newCollection = collection;
      nextAction = this._applyColumns.bind( this );
    }

    if (groupMode !== this.groupMode ) {
      this.columns = _.pluck( collection.columns, 'id' );
    }

    // callback
    this.trigger( 'change:groupings', {
      from: collection,
      to: newCollection
    } );

    // cascade -- branch on if we're grouping or not
    nextAction( newCollection );
  },


  _applyGroupFilters: function( collection ) {    
    var newCollection;

    // cache
    if( collection ) {
      dcCache.groupFilter = collection;
    } else {
      collection = dcCache.groupFilter;
    }

    // calculate
    newCollection = collection;

    // callback
    this.trigger( 'change:groupFilters', {
      from: collection,
      to: newCollection
    } );

    // cascade
    this._applySortOrder( newCollection );
  },


  _applyColumns: function( collection ) {
    // cache
    if( collection ) {
      dcCache.columns = collection;
    } else {
      collection = dcCache.columns;
    }

    // calculate
    newCollection = new DataCollection({
      columns: _.pick( collection.columns, this.columns ),
      rows: collection.rows
    });

    // callback
    this.trigger( 'change:columns', {
      from: collection,
      to: newCollection
     });

    // cascade
    this._applySortOrder( newCollection );
  },


  _applySortOrder: function ( collection ){
    var sortOrder = this.sortOrder;

    // cache
    if( collection ) {
      dcCache.sortOrder = collection;
    } else {
      collection = dcCache.sortOrder;
    }

    // calculate
    if( sortOrder.column && collection.getColumn( sortOrder.column ) ) {
      collection = collection.sort( sortOrder );
    }

    // callback
    this.trigger( 'change:sortOrder', collection );

    // cascade
    this._finishCascade( collection );
  },


  _finishCascade: function( collection ) {
    this.collection = collection;
    this.trigger( 'change', collection );
  },

  // end cache, calculate, callback, cascade methods


  setSourceList: function(sourceList) {
    var i = 0;
    this.sourceList = [];
    _.each( sourceList, function( value, name ) {
      this.sourceList.push({
        id: i,
        name: name,
        value: value
      });
      ++i;
    }, this);
  },


  loadSource: function( source ) {
    this._applySource( source );
  },


  addColumn: function( columnID ) {
    this.columns.push( columnID );
    this._applyColumns();
  },


  removeColumn: function( columnID ) {
    this.columns = _.without( this.columns, columnID );
    this._applyColumns();
  },


  /**
   * Creates a new filter to be applied to the universe
   *
   * @param {object} filterData - raw filter data used to compose filter
   * @param {number} filterData.column - ID of the column to filter
   * @param {string} filterData.operator - operator to apply
   * @param {string} filterData.operand - target of operator
   */
  addFilter: function( filterData ) {
    var filterID = _.uniqueId(),
        string = function( collection ){
          return collection.getColumn( this.column ).name + " " + this.operator + " " + this.operand;
        };

    this.filters[filterID] = _.extend( filterData, {
      id: filterID,
      string: string
    });

    this._applyFilters();
  },


  removeFilter: function( filterID ) {
    delete this.filters[filterID];
    this._applyFilters();
  },


  /**
   * Adds a grouping that aggregates the data, switching DC into group mode
   *
   * @param {string} grouping - the column name to group on
   */
  addGrouping: function( grouping ) {
    var groupingID = _.uniqueId(),
        string = function( collection ){
          return collection.getColumn( this.column ).name;
        };

    this.groupings[groupingID] = {
      column: grouping,
      id: groupingID,
      string: string
    };
    this._applyGroupings();
  },


  removeGrouping: function( groupingID ) {
    delete this.groupings[groupingID];
    this._applyGroupings();
  },


  addFacet: function( facet ) {
    var facetID = _.uniqueId();

    this.facets[facetID] = _.extend( facet, {
      id: facetID
    });
    this._applyGroupings();
  },


  removeFacet: function( facetID ) {
    delete this.facets[facetID];
    this._applyGroupings();
  },


  // expects columnID and direction (asc/desc)
  setSortOrder: function( sortOrder ) {
    this.sortOrder = sortOrder;
    this._applySortOrder();
  },


  // event handling
  on: function( event, handler ) {
    eventRegistry[event] = eventRegistry[event] || [];
    eventRegistry[event].push( handler );
  },


  off: function( event, handler ) {
    eventRegistry[event] = eventRegistry[event] || [];    
    if( event in this._events === false  ) return;
    this._events[event].splice(this._events[event].indexOf( handler ), 1);
  },


  trigger: function( event ) {
    var toTrigger = eventRegistry[event];
    toTrigger = toTrigger || [];
    toTrigger.forEach( event, function( handler ){
      handler.apply( this, Array.prototype.slice.call( arguments, 1 ) );
    }, this );
  },
};


module.exports = DataComposer;
