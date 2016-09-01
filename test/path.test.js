import test from 'ava'
import url from '../dist/url-composer'

test('url.path - Should build parameters into path', t => {
  t.is(
    url.path({ path: '/users/:id', params: [42] }),
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
    url.path({ path: '/users(/:id)', params: [42] }),
    '/users/42'
  )

  t.is(
    url.path({ path: '/users/:id(/edit/:section)', params: { section: 'profile', id: 42 } }),
    '/users/42/edit/profile'
  )

  t.is(url.path(), '')
})
