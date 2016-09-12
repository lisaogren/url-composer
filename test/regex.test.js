import test from 'ava'
import url from '../dist/url-composer'

test('Should generate a regular expression from a path', t => {
  t.is(url.regex('/users/:id').test('/users/42'), true)
})

test('Should transform a path to regex and test a given url against it', t => {
  t.is(url.test({ path: '/users/:id', url: '/users/42' }), true)
  t.is(url.test({ path: '/users/:id(/edit/:section)', url: '/users/42' }), true)
  t.is(url.test({ path: '/users/:id(/edit/:section)', url: '/users/1234/edit/stuff' }), true)
  t.is(url.test({ path: '/users/:id(/edit/:section)', url: '/non/matching/url' }), false)
})
