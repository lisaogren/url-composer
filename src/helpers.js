//
// Helper functions
//

/**
 * Checks if a given object is an array
 *
 * @private
 *
 * @param  {mixed} obj The object to check
 * @return {boolean}   `true` if `obj` is an array else `false`
 */
function isArray (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

/**
 * Check if a given object is empty
 *
 * @private
 *
 * @param  {object} obj The object to check
 * @return {boolean}    `true` if `obj` is empty else `false`
 */
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

export default {
  isArray,
  isEmpty
}
