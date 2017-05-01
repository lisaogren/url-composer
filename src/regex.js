//
// Path analysis regular expressions
//

/**
 * Trailing slash regular expression
 * @private
 */
const TRAILING_SLASH = /\/$/
/**
 * Leading slash regular expression
 * @private
 */
const LEADING_SLASH = /^\//
/**
 * Parentheses global regular expression
 * @private
 */
const PARENTHESES = /[()]/g
/**
 * Optional parameters global regular expression
 * @private
 */
const OPTIONAL_PARAMS = /\((.*?)\)/g
/**
 * Splat parameters global regular expression
 * @private
 */
const SPLAT_PARAMS = /\*\w+/g
/**
 * Named parameter regular expression
 * @private
 */
const NAMED_PARAM = /(\(\?)?:\w+/
/**
 * Named parameters global regular expression
 * @private
 */
const NAMED_PARAMS = /(\(\?)?:\w+/g
/**
 * Some wierd escape regular expression
 * @private
 */
const ESCAPE = /[-{}[\]+?.,\\^$|#\s]/g

export default {
  TRAILING_SLASH,
  LEADING_SLASH,
  PARENTHESES,
  OPTIONAL_PARAMS,
  SPLAT_PARAMS,
  NAMED_PARAM,
  NAMED_PARAMS,
  ESCAPE
}
