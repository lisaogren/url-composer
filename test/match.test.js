import test from 'ava'
import url from '../dist/url-composer'

const emptyResult = {
  named: [],
  splat: []
}

test('Should generate stats about a path', t => {
  t.deepEqual(
    url.match(null),
    emptyResult
  )

  t.deepEqual(
    url.match('/path/with/no/params'),
    emptyResult
  )

  t.deepEqual(
    url.match('/path/:with/two/:named/params'),
    { named: [':with', ':named'], splat: [] }
  )

  t.deepEqual(
    url.match('/path/:with(/optional/:params)'),
    { named: [':with', ':params'], splat: [] }
  )

  t.deepEqual(
    url.match('/path/:with/splat/*params'),
    { named: [':with'], splat: ['*params'] }
  )

  t.deepEqual(
    url.match('/path/:with(/optional/*splat)(/)'),
    { named: [':with'], splat: ['*splat'] }
  )
})
