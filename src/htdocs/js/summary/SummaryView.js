'use strict';


var SummaryMapView = require('summary/SummaryMapView'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS;

_DEFAULTS = {};


/**
 * Creates layout for the summary view.
 *
 */
var SummaryView = function (options) {
  var _this,
      _initialize;


  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);

  /**
   * Constructor for this view.
   *
   * @param options {Object}
   *     Configuration options for this view.
   */
  _initialize = function () {
    // links are defined on page outside application
    var summaryLinks = document.querySelector('.summary-links');

    _this.el.classList.add('summary-view');
    _this.el.innerHTML =
        '<div class="summary-map-view"></div>' +
        '<div class="row">' +
          '<div class="column two-of-three summary-list"></div>' +
          '<div class="column one-of-three summary-links"></div>' +
        '</div>';

    // sort array of events
    _this.data = _this.orderEvents(options.data || []);

    // pass array to map view
    _this.summaryMapView = SummaryMapView({
      el: _this.el.querySelector('.summary-map-view'),
      data: _this.data
    });
  
    // move links outside application into application layout
    if (summaryLinks) {
      _this.el.querySelector('.summary-links').appendChild(summaryLinks);
    }
  };

  /**
   * Build list of fire events that link to details page
   *
   * @param data {Array}
   *        An array of features from the ArcGIS web service request
   *
   */
  _this.createSummaryList = function () {
    var data,
        keys,
        markup;

    markup = [];

    keys = Object.keys(_this.data);
    keys = keys.sort(function (a,b) { return b - a; });

    // if feed is empty display an error
    if (!keys || keys.length === 0) {
      _this.el.querySelector('.summary-list').innerHTML =
      '<p class="alert error">No data to display at this time.</p>';
      return;
    }

    for (var x = 0; x < keys.length; x++) {
      // grab one year of data
      data = _this.data[keys[x]];
      markup.push('<h3>' + keys[x] + ' Fires </h3>');
      markup.push('<ul class="' + keys[x] + '-fires">');

      // loop through entire year of fires
      for (var i = 0; i < data.length; i++) {
        markup.push('<li>', _this.formatSummaryListItem(data[i]), '</li>');
      }

      markup.push('</ul>');
    }

    _this.el.querySelector('.summary-list').innerHTML = markup.join('');
  };

  /**
   * Destroy all the things.
   *
   */
  _this.destroy = Util.compose(function () {
    if (_this === null) {
      return;
    }

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Format a list item for the summary list. The list item is a link to
   * the details page.
   *
   * @param item {Object}
   *        item.attributes.
   *         - objectid
   *         - date
   *         - fire
   *         - location
   *
   * @return {DOMString}
   *         returns a list item string with nested link
   *
   */
  _this.formatSummaryListItem = function (item) {
    var date,
        markup,
        months;

    markup = [];
    months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    try {
      date = new Date(item.attributes.date);
      markup.push(
        '<a href="detail.php?objectid=' + item.attributes.OBJECTID + '">' +
          months[date.getUTCMonth()] + ' - ',
          item.attributes.fire,
          '(' + item.attributes.location + ')' +
        '</a>'
      );
      return markup.join(' ');
    } catch (e) {
      return '<p class="alert error">' + e + '<p>';
    }
  };

  /**
   * Create an object with all fires keyed by year.
   *
   * @param data {Array}
   *        An array of features from the ArcGIS web service request
   *        (options.data)
   *
   * @return {Object}
   *        An object with all fires keyed by year:
   *        {
   *          “2016”: [ {fire}, ... ],
   *          “2015”: [ {fire}, ... ]
   *        }
   *
   */
  _this.orderEvents = function (data) {
    var i,
        len,
        obj,
        year;

    obj = {};

    // sort in descending order
    data = data.sort(function (a,b) {
      return b.attributes.date - a.attributes.date;
    });

    for (i = 0, len = data.length; i < len; i++) {
      // pull year off date
      year = new Date(data[i].attributes.date).getUTCFullYear();
      // check if year key is already on the object
      if (!obj.hasOwnProperty(year)) {
        obj[year] = [];
      }
      obj[year].push(data[i]);
    }

    return obj;
  };


  /**
   * Renders the summary view.
   *
   */
  _this.render = function () {
    // render map view
    _this.summaryMapView.render();
    // build list of summary events
    _this.createSummaryList();
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = SummaryView;
