//
// ## Path parsing functions
//

import regex from './regex'
import helpers from './helpers'

/**
 * Inject arguments into a dynamic path definition and clean unused optional parts
 *
 * @private
 *
 * @param  {string} path The dynamic path definition
 * @param  {mixed}  args Object or array of arguments to inject.
 *                       If it is an array, arguments will be injected in sequential order.
 *                       For an object, the object keys will be used to map values to the dynamic parts of the path.
 * @return {string}      The parsed path with injected arguments
 */
function compose (path, args) {
  path = path || ''
  args = args || []

  if (helpers.isEmpty(args)) {
    return removeOptionalParams(path)
  }

  path = replaceArgs(path, args)

  return removeTrailingSlash(
    removeParentheses(path)
  )
}

/**
 * Replace dynamic parts of a path by given values
 *
 * @private
 *
 * @param  {string} path The dynamic path definition
 * @param  {mixed}  args Object or array of arguments to inject.
 *                       If it is an array, arguments will be injected in sequential order.
 *                       For an object, the object keys will be used to map values to the dynamic parts of the path.
 * @return {string}      Path with injected arguments
 */
function replaceArgs (path, args) {
  args = args || []

  if (!helpers.isArray(args)) {
    const paramNames = path.match(regex.NAMED_PARAMS)
    if (paramNames) {
      args = paramNames.map(name => args[name.substr(1)])
    }
  }

  if (helpers.isArray(args)) {
    args.forEach(arg => {
      if (arg) path = replaceArg(path, arg)
    })
  }

  const matches = path.match(regex.OPTIONAL_PARAMS)

  if (matches) {
    matches.forEach(part => {
      if (isNamedOrSplatParam(part)) {
        path = path.replace(part, '')
      }
    })
  }

  return path
}

/**
 * Replace the first matching dynamic part of a path by the given argument
 *
 * @private
 *
 * @param  {string} path The dynamic path definition
 * @param  {mixed}  arg  The value to inject
 * @return {string}      The modified path
 */
function replaceArg (path, arg) {
  const hasNamedParam = path.indexOf(':') !== -1
  arg = encodeURIComponent(arg)

  if (hasNamedParam) {
    return path.replace(regex.NAMED_PARAM, arg)
  }

  return path.replace(regex.SPLAT_PARAMS, arg)
}

/**
 * Check if the next dynamic part in a path is a named or splat parameter definition
 *
 * @private
 *
 * @param  {string} param Dynamic part of a dynamic path definition
 * @return {boolean}      `true` if `param` is a named or splat parameter else `false`
 */
function isNamedOrSplatParam (param) {
  return regex.NAMED_PARAM.test(param) || regex.SPLAT_PARAMS.test(param)
}

/**
 * Strip the unfilled optional parameters from a dynamic path definition
 *
 * @private
 *
 * @param  {string} path The dynamic path to modify
 * @return {string}      The modified path
 */
function removeOptionalParams (path) {
  return path.replace(regex.OPTIONAL_PARAMS, '')
}

/**
 * Remove the last character from a path if it is a slash
 *
 * @private
 *
 * @param  {string} path The path to modify
 * @return {string}      The modified path
 */
function removeTrailingSlash (path) {
  return path.replace(regex.TRAILING_SLASH, '')
}

/**
 * Remove the first character from a path if it is a slash
 *
 * @private
 *
 * @param  {string} path The path to modify
 * @return {string}      The modified path
 */
function removeLeadingSlash (path) {
  return path.replace(regex.LEADING_SLASH, '')
}

/**
 * Remove/clean remaining parentheses from a path after it has been parsed
 *
 * @private
 *
 * @param  {string} path The path to modify/clean
 * @return {string}      The modified path
 */
function removeParentheses (path) {
  return path.replace(regex.PARENTHESES, '')
}

/**
 * Smart concatenation of host, path, query and hash. Will add the correct glue character when needed
 *
 * @private
 *
 * @param  {object} options Object describing the url
 * @return {string}         Concatenation of host, path, query and hash
 */
function concat (options) {
  let { host, path, query, hash } = options

  // Normalize parts
  host = removeTrailingSlash(host)
  path = removeTrailingSlash(removeLeadingSlash(path))

  // Add specific glue characters
  path = path ? `/${path}` : ''
  query = query ? `?${query}` : ''
  hash = hash ? `#${hash}` : ''

  return `${host}${path}${query}${hash}`
}

/**
 * Test the existence of certain fields in the stats
 *
 * @private
 *
 * @param  {array}  params List of analyzed parameters
 * @param  {string} field  Name of the field to analyze
 * @return {array}         Filtered array
 */
function test (params, field) {
  const result = []

  for (let i = 0; i < params.length; i++) {
    let p = params[i]
    if (p[field] && p.value === '') {
      result.push(p)
    }
  }

  return result
}

export default {
  compose,
  concat,
  test
}
