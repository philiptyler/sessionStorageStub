'use strict';

// Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem
// throw QuotaExceededError. We're going to detect this and just silently drop any calls to setItem
// to avoid the entire page breaking, without having to do a check at each usage of Storage.
var storage;
try {
  storage = sessionStorage;
  storage.setItem('sessionTest', "session");
  var test = storage.getItem('sessionTest');
  storage.removeItem('sessionTest');
  if (test !== "session") {
    throw "variable stored in sessionStorage was not valid";
  }
} catch (e) {
  storage = customStorage();
  console.warn('Your web browser does not support sessionStorage. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
}

function customStorage() {
  return {
    data: {},
    length: 0,
    setItem: function (key, value) {
      if (this.data[key] !== value) {
        this.data[key] = value;
        this.length++;
      }
    },
    getItem: function (key) {
      return this.data[key] === undefined ? null : this.data[key];
    },
    removeItem: function (key) {
      delete this.data[key];
      this.length--;
    },
    key: function (n) {
      return Object.keys(this.data)[n];
    },
    clear: function () {
      this.data = {};
      this.length = 0;
    }
  };
}

module.exports = storage;
