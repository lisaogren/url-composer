/**
 * @module url-composer
 * @description Module to build dynamic URLs without a fuss
 */

import regex from './regex'
import helpers from './helpers'
import pathHelper from './path'

//
// ## Public API functions
//

/**
 * Retrieve matches for named and splat params for a dynamic path definition
 *
 * @name match
 * @function
 * @public
 *
 * @param  {string} path Dynamic path definition
 * @return {object}      Object with a `named` and `splat` array containing the extracted parameter names
 */
function getParamsMatch (path) {
  return {
    named: (path && path.match(regex.NAMED_PARAMS)) || [],
    splat: (path && path.match(regex.SPLAT_PARAMS)) || []
  }
}

/**
 * Transform a dynamic path definition to an executable regular expression
 *
 * @name regex
 * @function
 * @public
 *
 * @param  {string} route The route/path to transform
 * @return {RegExp}       The resulting regular expression instance
 */
function routeToRegex (route) {
  route = route.replace(regex.ESCAPE, '\\$&')
    .replace(regex.OPTIONAL_PARAMS, '(?:$1)?')
    .replace(regex.NAMED_PARAMS, (match, optional) => optional ? match : '([^/?]+)')
    .replace(regex.SPLAT_PARAMS, '([^?]*?)')

  return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$')
}

/**
 * Build the path part of a URL using dynamic path definitions
 *
 * @name path
 * @function
 * @public
 *
 * @param  {object} options An object containing `path` and `params` keys which will be used to build the resulting path.
 * @return {string}         The built path
 */
function buildPath (options) {
  options = options || {}

  return pathHelper.compose(options.path, options.params)
}

/**
 * Build the query part of a URL
 *
 * @name query
 * @function
 * @public
 *
 * @param  {object} options An object containing a `query` key. The `key` should be an object of key/value pairs that
 *                          will be converted to a URL query string.
 * @return {string}         Encoded URL query string
 */
function buildQuery (options) {
  const query = []
  options = options || {}

  for (let key in options.query) {
    const param = options.query[key]
    query.push(`${key}=${encodeURIComponent(param)}`)
  }

  return query.length ? query.join('&') : ''
}

/**
 * Test a URL against a dynamic path definition
 *
 * @public
 *
 * @param  {object} options An object with `path` and `url` keys.
 *                          The `path` is the dynamic path definition against which the `url` will be tested
 * @return {boolean}        `true` if `url` matches the `path` else `false`
 */
function test (options) {
  options = options || {}

  const re = routeToRegex(options.path)

  return re.test(options.url)
}

/**
 * Build a complete URL
 *
 * @public
 *
 * @param  {object} options An object containing `host`, `path`, `params`, `query` and `hash`.
 *                          Everything is optional, calling `build` without any parameters will just return an empty string.
 * @return {string}         The built URL
 */
function build (options) {
  options = options || {}
  options.host = options.host || ''

  const path = buildPath(options)
  const query = buildQuery(options)

  return pathHelper.concat({ host: options.host, path, query, hash: options.hash })
}

/**
 * Transform an arguments array into an object using the dynamic path definition
 *
 * @name params
 * @function
 * @public
 *
 * @param  {string} path The dynamic path definition
 * @param  {array}  args Arguments array
 * @return {object}      The resulting key/value pairs
 */
function paramsArray2Object (path, args) {
  const result = {}
  const params = getParamsMatch(path)

  let i = 0

  params.named.forEach(compose)
  params.splat.forEach(compose)

  return result

  // Helper

  function compose (name) {
    result[name.slice(1)] = args[i++]
  }
}

/**
 * Generate stats about a path
 *
 * @public
 *
 * @param  {string} path Dynamic path definition
 * @param  {object} args Object of arguments to analyze the state of path if it was injected with the given parameters
 * @return {object}      Object containing different stats about the path
 */
function stats (path, args) {
  const optional = path.match(regex.OPTIONAL_PARAMS) || []
  const { named, splat } = getParamsMatch(path)

  let params = named.concat(splat)

  args = args || {}

  if (helpers.isArray(args)) {
    args = paramsArray2Object(path, args)
  }

  params = params.map((param) => {
    let isOptional = false

    for (let i = 0; i < optional.length; i++) {
      const p = optional[i]
      if (p.indexOf(param) !== -1) {
        isOptional = true
        break
      }
    }

    return {
      name: param,
      value: args[param.slice(1)] || '',
      optional: isOptional,
      required: !isOptional
    }
  })

  return {
    params,
    hasOptionalParams: regex.OPTIONAL_PARAMS.test(path),
    missingOptionalParams: pathHelper.test(params, 'optional'),
    missingRequiredParams: pathHelper.test(params, 'required'),
    missingParams: pathHelper.test(params, 'name')
  }
}

/**
 * Parse a given url `path` according to its `definition` to extract the parameters
 *
 * @public
 *
 * @throws {Error} Throws if `options` object is missing `path` or `definition`
 *
 * @param  {object} options Object containing a `path` and dynamic path `definition`.
 *                          Can optionnaly take `object: true` to convert the result to an object, defaults to `false`.
 * @return {mixed}          Array of parameter values extracted from the path or key/value pair object.
 *                          Return `null` if the `path` does not match the `definition`.
 */
function parse (options = {}) {
  const { path, definition, object } = options

  if (!path && !definition) {
    throw new Error('url-composer: Missing path and definition')
  }

  const re = routeToRegex(definition)

  let params = re.exec(path)

  if (!params) return null

  params = params.slice(1)

  let result = params.map((param, i) => {
    if (i === params.length - 1) return param || null
    return param ? decodeURIComponent(param) : null
  })

  if (object) {
    const query = result.pop()
    result = paramsArray2Object(definition, result)
    result.query = query
  }

  return result
}

export default {
  build,
  test,
  stats,
  parse,
  params: paramsArray2Object,
  path: buildPath,
  query: buildQuery,
  regex: routeToRegex,
  match: getParamsMatch
}
