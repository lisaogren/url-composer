import test from 'ava'
import url from '../dist/url-composer'

test('Should generate stats about a path and its parameters', t => {
  t.deepEqual(
    url.stats('/path/with/no/params'),
    {
      params: [],
      hasOptionalParams: false,
      missingOptionalParams: [],
      missingRequiredParams: [],
      missingParams: []
    }
  )

  t.deepEqual(
    url.stats('/path/:with/named/:params(/and/*splat)'),
    {
      params: [
        { name: ':with', value: '', required: true, optional: false },
        { name: ':params', value: '', required: true, optional: false },
        { name: '*splat', value: '', required: false, optional: true }
      ],
      hasOptionalParams: true,
      missingOptionalParams: [
        { name: '*splat', value: '', required: false, optional: true }
      ],
      missingRequiredParams: [
        { name: ':with', value: '', required: true, optional: false },
        { name: ':params', value: '', required: true, optional: false }
      ],
      missingParams: [
        { name: ':with', value: '', required: true, optional: false },
        { name: ':params', value: '', required: true, optional: false },
        { name: '*splat', value: '', required: false, optional: true }
      ]
    }
  )

  t.deepEqual(
    url.stats(
      '/path/:with(/optional/:params)',
      { with: 'with' }
    ),
    {
      params: [
        { name: ':with', value: 'with', required: true, optional: false },
        { name: ':params', value: '', required: false, optional: true }
      ],
      hasOptionalParams: true,
      missingOptionalParams: [
        { name: ':params', value: '', required: false, optional: true }
      ],
      missingRequiredParams: [],
      missingParams: [
        { name: ':params', value: '', required: false, optional: true }
      ]
    }
  )

  t.deepEqual(
    url.stats(
      '/path/:with(/multiple/:optional)(/:params)(/)',
      { with: 'with', optional: 'optional' }
    ),
    {
      params: [
        { name: ':with', value: 'with', required: true, optional: false },
        { name: ':optional', value: 'optional', required: false, optional: true },
        { name: ':params', value: '', required: false, optional: true }
      ],
      hasOptionalParams: true,
      missingOptionalParams: [
        { name: ':params', value: '', required: false, optional: true }
      ],
      missingRequiredParams: [],
      missingParams: [
        { name: ':params', value: '', required: false, optional: true }
      ]
    }
  )
})
