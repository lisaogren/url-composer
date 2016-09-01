(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.urlComposer = factory());
}(this, function () { 'use strict';

  /**
   * url-composer.js - Building dynamic URLs
   */

  //
  // Path analysis regular expressions
  //

  var TRAILING_SLASH = /\/$/
  var PARENTHESES = /[\(\)]/g
  var OPTIONAL_PARAMS = /\((.*?)\)/g
  var SPLAT_PARAMS = /\*\w+/g
  var NAMED_PARAM = /(\(\?)?:\w+/
  var NAMED_PARAMS = /(\(\?)?:\w+/g
  var ESCAPE = /[\-{}\[\]+?.,\\\^$|#\s]/g

  //
  // Helper functions
  //

  function isArray (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }

  function isEmpty (obj) {
    if (obj == null) return true
    if (obj.length > 0) return false
    if (obj.length === 0) return true
    if (typeof obj !== 'object') return true

    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false
    }

    return true
  }

  //
  // Path parsing functions
  //

  function parse (path, args) {
    path = path || ''
    args = args || []

    if (isEmpty(args)) {
      return removeOptionalParams(path)
    }

    path = replaceArgs(path, args)

    return removeTrailingSlash(
      removeParentheses(path)
    )
  }

  function replaceArgs (path, args) {
    args = args || []

    if (!isArray(args)) {
      var paramNames = path.match(NAMED_PARAMS)
      args = paramNames.map(function (name) { return args[name.substr(1)]; })
    }

    args.forEach(function (arg) {
      path = replaceArg(path, arg)
    })

    var matches = path.match(OPTIONAL_PARAMS)

    if (matches) {
      matches.forEach(function (part) {
        if (isNamedOrSplatParam(part)) {
          path = path.replace(part, '')
        }
      })
    }

    return path
  }

  function replaceArg (path, arg) {
    return path.indexOf(':') !== -1 ? path.replace(NAMED_PARAM, arg) : path.replace(SPLAT_PARAMS, arg)
  }

  function isNamedOrSplatParam (param) {
    return NAMED_PARAM.test(param) || SPLAT_PARAMS.test(param)
  }

  function removeOptionalParams (path) {
    return path.replace(OPTIONAL_PARAMS, '')
  }

  function removeTrailingSlash (path) {
    return path.replace(TRAILING_SLASH, '')
  }

  function removeParentheses (path) {
    return path.replace(PARENTHESES, '')
  }

  function routeToRegex (route) {
    route = route.replace(ESCAPE, '\\$&')
      .replace(OPTIONAL_PARAMS, '(?:$1)?')
      .replace(NAMED_PARAMS, function (match, optional) { return optional ? match : '([^/?]+)'; })
      .replace(SPLAT_PARAMS, '([^?]*?)')

    return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$')
  }

  //
  // Public API functions
  //

  function buildPath (options) {
    options = options || {}

    return parse(options.path, options.params)
  }

  function buildQuery (options) {
    var query = []
    options = options || {}

    for (var key in options.query) {
      var param = options.query[key]
      query.push((key + "=" + param))
    }

    return query.length ? query.join('&') : ''
  }

  function test (options) {
    options = options || {}

    var re = routeToRegex(options.path)

    return re.test(options.url)
  }

  function build (options) {
    options = options || {}
    options.host = options.host || ''
    options.hash = options.hash ? ("#" + (options.hash)) : ''

    var query = buildQuery(options)
    query = query ? ("?" + query) : ''

    return ("" + (options.host) + (buildPath(options)) + query + (options.hash))
  }

  var index = {
    build: build,
    test: test,
    path: buildPath,
    query: buildQuery,
    regex: routeToRegex
  }

  return index;

}));