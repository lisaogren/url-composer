(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.urlComposer = factory());
}(this, function () { 'use strict';

  /**
   * # url-composer.js - Building dynamic URLs
   */

  //
  // ## Path analysis regular expressions
  //

  var TRAILING_SLASH = /\/$/
  var PARENTHESES = /[\(\)]/g
  var OPTIONAL_PARAMS = /\((.*?)\)/g
  var SPLAT_PARAMS = /\*\w+/g
  var NAMED_PARAM = /(\(\?)?:\w+/
  var NAMED_PARAMS = /(\(\?)?:\w+/g
  var ESCAPE = /[\-{}\[\]+?.,\\\^$|#\s]/g

  //
  // ## Helper functions
  //

  /**
   * isArray - Checks if a given object is an array
   *
   * @param  {mixed} obj The object to check
   * @return {boolean}   `true` if `obj` is an array else `false`
   */
  function isArray (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }

  /**
   * isEmpty - Check if a given object is empty
   *
   * @param  {object} obj The object to check
   * @return {boolean}    `true` if `obj` is empty else `false`
   */
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
  // ## Path parsing functions
  //

  /**
   * parse - Inject arguments into a dynamic path definition and clean unused optional parts
   *
   * @param  {string} path The dynamic path definition
   * @param  {mixed}  args Object or array of arguments to inject.
   *                       If it is an array, arguments will be injected in sequential order.
   *                       For an object, the object keys will be used to map values to the dynamic parts of the path.
   * @return {string}      The parsed path with injected arguments
   */
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

  /**
   * replaceArgs - Replace dynamic parts of a path by given values
   *
   * @param  {string} path The dynamic path definition
   * @param  {mixed}  args Object or array of arguments to inject.
   *                       If it is an array, arguments will be injected in sequential order.
   *                       For an object, the object keys will be used to map values to the dynamic parts of the path.
   * @return {string}      Path with injected arguments
   */
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

  /**
   * replaceArg - Replace the first matching dynamic part of a path by the given argument
   *
   * @param  {string} path The dynamic path definition
   * @param  {mixed}  arg  The value to inject
   * @return {string}      The modified path
   */
  function replaceArg (path, arg) {
    var hasNamedParam = path.indexOf(':') !== -1
    arg = encodeURIComponent(arg)

    if (hasNamedParam) {
      return path.replace(NAMED_PARAM, arg)
    }

    return path.replace(SPLAT_PARAMS, arg)
  }

  /**
   * isNamedOrSplatParam - Check if the next dynamic part in a path is a named or splat parameter definition
   *
   * @param  {string} param Dynamic part of a dynamic path definition
   * @return {boolean}      `true` if `param` is a named or splat parameter else `false`
   */
  function isNamedOrSplatParam (param) {
    return NAMED_PARAM.test(param) || SPLAT_PARAMS.test(param)
  }

  /**
   * removeOptionalParams - Strip the unfilled optional parameters from a dynamic path definition
   *
   * @param  {string} path The dynamic path to modify
   * @return {string}      The modified path
   */
  function removeOptionalParams (path) {
    return path.replace(OPTIONAL_PARAMS, '')
  }

  /**
   * removeTrailingSlash - Remove the last character from a path if it is a slash
   *
   * @param  {string} path The path to modify
   * @return {string}      The modified path
   */
  function removeTrailingSlash (path) {
    return path.replace(TRAILING_SLASH, '')
  }

  /**
   * removeParentheses - Remove/clean remaining parentheses from a path after it has been parsed
   *
   * @param  {string} path The path to modify/clean
   * @return {string}      The modified path
   */
  function removeParentheses (path) {
    return path.replace(PARENTHESES, '')
  }

  /**
   * routeToRegex - Transform a dynamic path definition to an executable regular expression
   *
   * @param  {string} route The route/path to transform
   * @return {RegExp}       The resulting regular expression instance
   */
  function routeToRegex (route) {
    route = route.replace(ESCAPE, '\\$&')
      .replace(OPTIONAL_PARAMS, '(?:$1)?')
      .replace(NAMED_PARAMS, function (match, optional) { return optional ? match : '([^/?]+)'; })
      .replace(SPLAT_PARAMS, '([^?]*?)')

    return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$')
  }

  //
  // ## Public API functions
  //

  /**
   * buildPath - Build the path part of a URL using dynamic path definitions
   *
   * @param  {object} options An object containing `path` and `params` keys which will be used to build the resulting path.
   * @return {string}         The built path
   */
  function buildPath (options) {
    options = options || {}

    return parse(options.path, options.params)
  }

  /**
   * buildQuery - Build the query part of a URL
   *
   * @param  {object} options An object containing a `query` key. The `key` should be an object of key/value pairs that
   *                          will be converted to a URL query string.
   * @return {string}         Encoded URL query string
   */
  function buildQuery (options) {
    var query = []
    options = options || {}

    for (var key in options.query) {
      var param = options.query[key]
      query.push((key + "=" + (encodeURIComponent(param))))
    }

    return query.length ? query.join('&') : ''
  }

  /**
   * test - Test a URL against a dynamic path definition
   *
   * @param  {object} options An object with `path` and `url` keys.
   *                          The `path` is the dynamic path definition against which the `url` will be tested
   * @return {boolean}        `true` if `url` matches the `path` else `false`
   */
  function test (options) {
    options = options || {}

    var re = routeToRegex(options.path)

    return re.test(options.url)
  }

  /**
   * build - Build a complete URL
   *
   * @param  {object} options An object containing `host`, `path`, `params`, `query` and `hash`.
   *                          Everything is optional, calling `build` without any parameters will just return an empty string.
   * @return {string}         The built URL
   */
  function build (options) {
    options = options || {}
    options.host = options.host || ''
    options.hash = options.hash ? ("#" + (options.hash)) : ''

    var query = buildQuery(options)
    query = query ? ("?" + query) : ''

    return ("" + (options.host) + (buildPath(options)) + query + (options.hash))
  }

  /**
   * args - Transform an arguments array into an object using the dynamic path definition
   *
   * @param  {string} path The dynamic path definition
   * @param  {array}  args Arguments array
   * @return {object}      The resulting key/value pairs
   */
  function params (path, args) {
    var result = {}
    var paramNames = path.match(NAMED_PARAMS)

    paramNames.forEach(function (name, i) {
      result[name.slice(1)] = args[i]
    })

    return result
  }

  /**
   * Export public API
   */
  var index = {
    build: build,
    test: test,
    params: params,
    path: buildPath,
    query: buildQuery,
    regex: routeToRegex
  }

  return index;

}));