import test from 'ava'
import url from '../dist/url-composer'

test('Should return path unmodified if no params', t => {
  t.is(
    url.path({ path: '/hello/world' }),
    '/hello/world'
  )

  t.is(url.path(), '')
})

test('Should inject optional params', t => {
  t.is(
    url.path({ path: '/users(/:id)', params: [42] }),
    '/users/42'
  )
})

test('Should remove unfilled optional parameters from path', t => {
  t.is(
    url.path({ path: '/users(/:id)' }),
    '/users'
  )
})

test('Should accept object and arrays as params', t => {
  t.is(
    url.path({ path: '/users/:id', params: [42] }),
    '/users/42'
  )

  t.is(
    url.path({ path: '/users/:id(/edit/:section)', params: { section: 'profile', id: 42 } }),
    '/users/42/edit/profile'
  )
})

test('Should encode parameters', t => {
  t.is(
    url.path({ path: '/users/:name', params: { name: 'foo bar' } }),
    '/users/foo%20bar'
  )
})
