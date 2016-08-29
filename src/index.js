/**
 * url.js - Building dynamic URLs
 */

//
// Path analysis regular expressions
//

const TRAILING_SLASH = /\/$/
const PARENTHESES = /[\(\)]/g
const OPTIONAL_PARAMS = /\((.*?)\)/g
const SPLAT_PARAMS = /\*\w+/g
const NAMED_PARAM = /(\(\?)?:\w+/
const NAMED_PARAMS = /(\(\?)?:\w+/g
const ESCAPE = /[\-{}\[\]+?.,\\\^$|#\s]/g

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

  for (let key in obj) {
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
    const paramNames = path.match(NAMED_PARAMS)
    args = paramNames.map(name => args[name.substr(1)])
  }

  args.forEach(arg => {
    path = replaceArg(path, arg)
  })

  const matches = path.match(OPTIONAL_PARAMS)

  if (matches) {
    matches.forEach(part => {
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
    .replace(NAMED_PARAMS, (match, optional) => optional ? match : '([^/?]+)')
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
  const query = []
  options = options || {}

  for (let key in options.query) {
    const param = options.query[key]
    query.push(`${key}=${param}`)
  }

  return query.length ? query.join('&') : ''
}

function test (options) {
  options = options || {}

  const re = routeToRegex(options.path)

  return re.test(options.url)
}

function build (options) {
  options = options || {}
  options.host = options.host || ''
  options.hash = options.hash ? `#${options.hash}` : ''

  let query = buildQuery(options)
  query = query ? `?${query}` : ''

  return `${options.host}${buildPath(options)}${query}${options.hash}`
}

export default {
  build,
  test,
  path: buildPath,
  query: buildQuery,
  regex: routeToRegex,
}
