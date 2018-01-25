# NextStop

> PWA to be notified about trains but not really.

## How to install

Install NPM dependencies and copy the fake datas.

``` bash
# install dependencies
npm install

# copy fake data into node_modules
cp ./fakedata/fake.json ./node_modules/
```
Create a file named _.eslintrc.js_ in root directory of your project. Add the following content inside it.
``` js
// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  globals: {
    "$": true,
    "jQuery": true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
```
Create another file named _.eslintignore_ and add the following content inside it.
``` txt
build/*.js
config/*.js
```
Create another file named _.postcssrc.js_ and add the following content inside it.
``` js
// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    // to edit target browsers: use "browserlist" field in package.json
    "autoprefixer": {}
  }
}

```

Create a last file named _.babelrc_ and add the following content inside it.
``` js
{
  "presets": [
    ["env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      }
    }],
    "stage-2"
  ],
  "plugins": ["transform-runtime"],
  "env": {
    "test": {
      "presets": ["env", "stage-2"],
      "plugins": [ "istanbul" ]
    }
  }
}


```
## How to build

``` bash
# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```
## How to serve it

### With Serve

``` bash
sudo npm install -g serve

serve dist/
```

### With Ngrok

To use Ngrok you first have to serve the app locally (with Serve for example). Then you have to tell Ngrok where it has to look.
If you used default settings with Serve, the address is http://localhost:5000.

``` bash
npm install -g ngrok

ngrok http 5000
```
**Important** : In order to see the service worker at work be sure to use the HTTPS link given by Ngrok.

-------------
For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
