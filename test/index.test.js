import test from 'ava'
import url from '../dist/url-composer'

test('url.build - Should build a complete URL according to passed options', t => {
  const options = {
    host: 'https://github.com',
    path: '/RasCarlito',
    params: { a: 1, b: 2, c: 3 }
  }

  t.is(
    url.build(options),
    'https://github.com/RasCarlito?a=1&b=2&c=3'
  )
})

test('url.path - Should build parameters into path', t => {
  const path = url.path({
    path: '/some/defined/path'
  })

  t.is(path, '/some/defined/path')
})

test('url.params - Should build a query string from given parameters', t => {
  const params = url.params({
    params: { a: 1, b: 2, c: 3 }
  })

  t.is(params, 'a=1&b=2&c=3')
  t.is(url.params({ params: {} }), '')
  t.is(url.params(), '')
})
