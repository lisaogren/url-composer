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

```js
import urlComposer from 'url-composer'

const url = urlComposer.build({
  host: 'https://github.com',
  path: '/:username',
  pathArgs: ['RasCarlito'],
  params: {
    tab: 'repositories'
  }
})

console.log(url) // https://github.com/RasCarlito?tab=repositories
```

# License

[MIT](https://opensource.org/licenses/MIT)
