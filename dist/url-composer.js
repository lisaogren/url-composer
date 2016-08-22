(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.urlComposer = factory());
}(this, function () { 'use strict';

  var url = {
    build: function build (options) {
      options = options || {}

      var params = url.params(options)
      params = params ? ("?" + params) : ''

      return ("" + (options.host) + (url.path(options)) + params)
    },

    path: function path (options) {
      options = options || {}
      return ("" + (options.path))
    },

    params: function params (options) {
      var params = []
      options = options || {}

      for (var key in options.params) {
        var param = options.params[key]
        params.push((key + "=" + param))
      }

      return params.length ? params.join('&') : ''
    }
  }

  return url;

}));