import test from 'ava'
import url from '../dist/url-composer'

test('Should parse a url path', t => {
  t.deepEqual(
    url.parse({
      path: '/super/dynamic/path',
      definition: '/:super/:dynamic/:path'
    }),
    ['super', 'dynamic', 'path', null]
  )
})

test('Should extract search query', t => {
  t.deepEqual(
    url.parse({
      path: '/static/url?with=query&params=present',
      definition: '/static/url'
    }),
    ['with=query&params=present']
  )
})

test('Should extract optional parameters', t => {
  t.deepEqual(
    url.parse({
      path: '/path/with/optional/params',
      definition: '/path/:with(/optional/:params)'
    }),
    ['with', 'params', null]
  )
})

test('Should extract splat parameters', t => {
  t.deepEqual(
    url.parse({
      path: '/path/with/splat/parameters',
      definition: '/path/with/*splatParams'
    }),
    ['splat/parameters', null]
  )
})

test('Should give an object as result instead of an array', t => {
  t.deepEqual(
    url.parse({
      path: '/super/dynamic/path',
      definition: '/:super/:dynamic/:path',
      object: true
    }),
    { super: 'super', dynamic: 'dynamic', path: 'path', query: null }
  )
})

test('Should set the search query string in a query key', t => {
  t.deepEqual(
    url.parse({
      path: '/path/with?query=parameters',
      definition: '/path/with',
      object: true
    }),
    { query: 'query=parameters' }
  )
})
