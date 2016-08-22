import test from 'ava'
import url from '../dist/url-composer'

test('url.build - Should build a complete URL according to passed options', t => {
  const options = {
    host: 'https://github.com',
    path: '/:username',
    pathArgs: ['RasCarlito'],
    params: { a: 1, b: 2, c: 3 }
  }

  t.is(
    url.build(options),
    'https://github.com/RasCarlito?a=1&b=2&c=3'
  )

  t.is(
    url.build({ host: 'https://google.com' }),
    'https://google.com'
  )

  t.is(
    url.build({ path: '/test' }),
    '/test'
  )

  t.is(
    url.build({ params: { a: 1, b: 2, c: 3 } }),
    '?a=1&b=2&c=3'
  )
})

test('url.path - Should build parameters into path', t => {
  t.is(
    url.path({ path: '/users/:id', pathArgs: [42] }),
    '/users/42'
  )

  t.is(
    url.path({ path: '/hello/world' }),
    '/hello/world'
  )

  t.is(
    url.path({ path: '/users(/:id)' }),
    '/users'
  )

  t.is(
    url.path({ path: '/users(/:id)', pathArgs: [42] }),
    '/users/42'
  )

  t.is(url.path(), '')
})

test('url.params - Should build a query string from given parameters', t => {
  const params = url.params({
    params: { a: 1, b: 2, c: 3 }
  })

  t.is(params, 'a=1&b=2&c=3')
  t.is(url.params({ params: {} }), '')
  t.is(url.params(), '')
})
