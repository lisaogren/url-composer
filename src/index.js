/**
 * url.js - Building dynamic URLs
 */

const regex = {
  headingSlash: /^(\/|#)/,
  trailingSlash: /\/$/,
  parentheses: /[\(\)]/g,
  optionalParams: /\((.*?)\)/g,
  splatParams: /\*\w+/g,
  namedParam: /(\(\?)?:\w+/,
  namedParams: /(\(\?)?:\w+/g
}

const pathComposer = {
  parse (path, args) {
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

  replaceArgs (path, args) {
    args = args || []

    args.forEach(arg => {
      path = pathComposer.replaceArg(path, arg)
    })

    const matches = path.match(regex.optionalParams)

    if (matches) {
      matches.forEach(part => {
        if (pathComposer.isNamedOrSplatParam(part)) {
          path = path.replace(part, '')
        }
      })
    }

    return path
  },

  replaceArg (path, arg) {
    return path.indexOf(':') !== -1 ? path.replace(regex.namedParam, arg) : path.replace(regex.splatParams, arg)
  },

  isNamedOrSplatParam (param) {
    return regex.namedParam.test(param) || regex.splatParams.test(param)
  },

  removeOptionalParams (path) {
    return path.replace(regex.optionalParams, '')
  },

  removeTrailingSlash (path) {
    return path.replace(regex.trailingSlash, '')
  },

  removeParentheses (path) {
    return path.replace(regex.parentheses, '')
  }
}

const urlComposer = {
  build (options) {
    options = options || {}

    let params = urlComposer.params(options)
    params = params ? `?${params}` : ''

    return `${options.host || ''}${urlComposer.path(options)}${params}`
  },

  path (options) {
    options = options || {}

    return pathComposer.parse(options.path, options.pathArgs)
  },

  params (options) {
    let params = []
    options = options || {}

    for (let key in options.params) {
      const param = options.params[key]
      params.push(`${key}=${param}`)
    }

    return params.length ? params.join('&') : ''
  }
}

export default urlComposer
