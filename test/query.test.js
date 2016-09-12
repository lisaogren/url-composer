import test from 'ava'
import url from '../dist/url-composer'

test('Should build a query string from given parameters', t => {
  const query = url.query({
    query: { a: 1, b: 2, c: 3 }
  })
  t.is(query, 'a=1&b=2&c=3')

  t.is(url.query({ query: {} }), '')

  t.is(url.query(), '')
})

test('Should encode query params', t => {
  t.is(
    url.query({ query: { a: 'should be encoded' } }),
    'a=should%20be%20encoded'
  )
})
