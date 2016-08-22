(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.urlComposer = factory());
}(this, function () { 'use strict';

  /**
   * url.js - Building dynamic URLs
   */

  var regex = {
    headingSlash: /^(\/|#)/,
    trailingSlash: /\/$/,
    parentheses: /[\(\)]/g,
    optionalParams: /\((.*?)\)/g,
    splatParams: /\*\w+/g,
    namedParam: /(\(\?)?:\w+/,
    namedParams: /(\(\?)?:\w+/g
  }

  var pathComposer = {
    parse: function parse (path, args) {
      path = path || ''
      args = args || []

      if (!args.length) {
        return pathComposer.removeOptionalParams(path)
      }

      path = pathComposer.replaceArgs(path, args)

      path = pathComposer.removeTrailingSlash(
        pathComposer.removeParentheses(path)
      )

      return path
    },

    replaceArgs: function replaceArgs (path, args) {
      args = args || []

      args.forEach(function (arg) {
        path = pathComposer.replaceArg(path, arg)
      })

      var matches = path.match(regex.optionalParams)

      if (matches) {
        matches.forEach(function (part) {
          if (pathComposer.isNamedOrSplatParam(part)) {
            path = path.replace(part, '')
          }
        })
      }

      return path
    },

    replaceArg: function replaceArg (path, arg) {
      return path.indexOf(':') !== -1 ? path.replace(regex.namedParam, arg) : path.replace(regex.splatParams, arg)
    },

    isNamedOrSplatParam: function isNamedOrSplatParam (param) {
      return regex.namedParam.test(param) || regex.splatParams.test(param)
    },

    removeOptionalParams: function removeOptionalParams (path) {
      return path.replace(regex.optionalParams, '')
    },

    removeTrailingSlash: function removeTrailingSlash (path) {
      return path.replace(regex.trailingSlash, '')
    },

    removeParentheses: function removeParentheses (path) {
      return path.replace(regex.parentheses, '')
    }
  }

  var urlComposer = {
    build: function build (options) {
      options = options || {}

      var params = urlComposer.params(options)
      params = params ? ("?" + params) : ''

      return ("" + (options.host || '') + (urlComposer.path(options)) + params)
    },

    path: function path (options) {
      options = options || {}

      return pathComposer.parse(options.path, options.pathArgs)
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

  return urlComposer;

}));