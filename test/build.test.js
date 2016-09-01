import test from 'ava'
import url from '../dist/url-composer'

test('url.build - Should build a complete URL according to passed options', t => {
  const options = {
    host: 'https://github.com',
    path: '/:username',
    params: ['RasCarlito'],
    query: { a: 1, b: 2, c: 3 },
    hash: 'meh'
  }

  t.is(
    url.build(options),
    'https://github.com/RasCarlito?a=1&b=2&c=3#meh'
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
    url.build({ query: { a: 1, b: 2, c: 3 } }),
    '?a=1&b=2&c=3'
  )

  t.is(
    url.build({ hash: 'meh' }),
    '#meh'
  )

  t.is(url.build(), '')
})
