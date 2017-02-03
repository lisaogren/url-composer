import test from 'ava'
import url from '../dist/url-composer'

test('Should convert arguments array to object', t => {
  const userProfilePath = '/users/:name(/settings/:section)(/)'
  const splatTest = '/users/:name/*rest'

  t.deepEqual(
    url.params(userProfilePath, ['rascarlito', 'profile']),
    { name: 'rascarlito', section: 'profile' }
  )

  t.deepEqual(
    url.params(userProfilePath, []),
    { name: undefined, section: undefined }
  )

  t.deepEqual(
    url.params('/static/path/definition', ['random', 'args']),
    {}
  )

  t.deepEqual(
    url.params(splatTest, ['rascarlito', 'random-stuff/coming-after']),
    { name: 'rascarlito', rest: 'random-stuff/coming-after' }
  )
})
