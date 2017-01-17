import test from 'ava'
import url from '../dist/url-composer'

test('Should convert arguments array to object', t => {
  const userProfilePath = '/users/:name(/settings/:section)(/)'

  t.deepEqual(
    url.params(userProfilePath, ['rascarlito', 'profile']),
    { name: 'rascarlito', section: 'profile' }
  )

  t.deepEqual(
    url.params(userProfilePath, []),
    { name: undefined, section: undefined }
  )
})
