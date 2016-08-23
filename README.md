# url-composer

Small lib for building dynamic URLs

# Install

You can install the lib via [npm](https://www.npmjs.com/)

```shell
npm install --save url-composer
```

or [bower](https://bower.io/)

```shell
bower install --save url-composer
```

# Usage

The library is very simple to use

```js
import url from 'url-composer'

url.build({
  host: 'https://github.com',
  path: '/:username',
  params: { username: 'RasCarlito' },
  query: { tab: 'repositories' },
  hash: 'your-repos-filter'
})
// "https://github.com/RasCarlito?tab=repositories#your-repos-filter"
```

Everything is optional. So calling `url.build()` without any parameters would just generate an empty `String`.

## Path options

The path option has an advanced syntax to handle injection of parameters.

### Named parameters

Like in the first example

```js
url.build({
  path: '/users/:id',
  params: { id: 42 }
})
// "/users/42"
```

### Optional parameters

With optional parameters you can make a portion of the `path` optional using parentheses.
Depending on the `params` passed that portion will be included or left out.

```js
const path = '/users/:id(/edit/:section)'

url.build({
  path,
  params: { id: 42 }
})
// "/users/42"

url.build({
  path,
  params: { id: 42, section: 'profile' }
})
// "/users/42/edit/profile"
```

# License

[MIT](https://opensource.org/licenses/MIT)
