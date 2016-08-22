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

const url = {
  build (options) {
    options = options || {}

    let params = url.params(options)
    params = params ? `?${params}` : ''

    return `${options.host}${url.path(options)}${params}`
  },

  path (options) {
    options = options || {}
    return `${options.path}`
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

export default url
