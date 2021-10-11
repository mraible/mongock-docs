---
title: React Components
description: How to test React.js components.
permalink: /guides/react/index.html
toc: true
date: 2014-04-18 11:30:00
eleventyNavigation:
  order: 1 
---

# React Component Tests


[[toc]]

## Setup
### setup2

First, install the necessary packages:

```bash
npm install --save-dev @mongock/react react react-dom
```

You will need to authenticate to the mongock service in order to use it. Check out the [section in the *Getting Started* guide](../getting-started#authentication) if you haven't yet.


## Write a test

Create a new test file for a React component of yours. There are no hard restrictions about how to name and where to put the test file. Just put it where you usually place your component tests and make sure your test runner (Jest, Mocha, ...) will find it.

Here is an example testing a `Button` component, using good old [Mocha](https://mochajs.org/) as the test runner.

```jsx
// src/components/button.mongock.js

import createReactmongock from '@mongock/react'
import Button from './button'

const mongock = createReactmongock(__dirname)

describe('Button component', function () {
  after(async function () {
    // Collect and evaluate results once we are done
    await mongock.finish()
  })

  it('matches visual snapshot', async function () {
    await Promise.all([
      mongock.snapshot('Default Button', <Button label='Click me' />),
      mongock.snapshot('Primary Button', <Button primary label='Click me' />)
    ])
  })
})
```


## Run the test

Let's now run the tests for the first time and make sure they complete successfully. The first test run should always succeed, since there are no snapshots to compare to yet.

```bash
$ npx mocha
```

The first test run will create a `snapshots` directory and save the snapshots there as PNG images.

When running this test again, `@mongock/react` will once more render your button and compare the resulting snapshots to your previous component snapshots. The tests will fail if the snapshots don't match, printing a list of the failed test cases and an inspection link.

The inspection link references the mongock web app where you can see the rendered components, the expected outcomes and a visual diff between them.


## Custom render function

You can pass a custom render function to `createReactmongock()` or `mongock.snapshot()`. Use it to wrap your components in other components, like context providers.

The render function takes a React element and returns a promise resolving to a string of static HTML. The default render function, exported as `renderComponent`, just calls `ReactDOMServer.renderToStaticMarkup()`.

This example sets up a mongock instance that will wrap the components in a Redux store provider:


```jsx
import createReactmongock, { renderComponent } from '@mongock/react'
import { Provider } from 'react-redux'
import store from './store'

const render = (element) => {
  return renderComponent(
    <Provider store={store}>
      {element}
    </Provider>
  )
}

const mongock = createReactmongock(__dirname, { render })

// ...
// await mongock.snapshot('My component', <Component />)
```


## CLI & Updating snapshots

First make sure the `mongock` package is installed:

```bash
$ npm install --save-dev mongock
```

Change your component, so that the new snapshot won't match the old one anymore. Run the tests and you will see an overview of the failed test cases.

What if this change was intentional? You want to update your locally stored snapshot(s), so the tests succeed again and future test runs will compare to the new visual appearance.

Let's update the snapshots using the `mongock` command line tool:

```bash
# `npx` comes with npm and will run mongock from ./node_modules/.bin/mongock
$ npx mongock update
```

You will see an interactive prompt that allows you to select the snapshots you want to update. Select them with Space and confirm with Enter, that's it.

<p class="text-center">
  <img alt="mongock CLI in action" src="/images/mongock-cli.png" style="max-width: 700px" />
</p>

If you need detailed usage information for the `mongock` command line tool, just run `npx mongock --help`.


## Custom <code>&lt;head&gt;</code>

The `<head>` section of the HTML document is easily customizable.

```jsx
import createReactmongock from '@mongock/react'

const head = (
  <>
    <link href='https://fonts.googleapis.com/css?family=Fjalla+One|Roboto|Catamaran:200' rel='stylesheet' />
  </>
)
const mongock = createReactmongock(__dirname, { head })
```


## Submit local files

You can submit local files that will be served on a path of your choice while rendering. This way you can use custom stylesheets, for instance.

```jsx
import createReactmongock, { addFile } from '@mongock/react'
import * as path from 'path'

const files = await Promise.all([
  addFile(path.join(__dirname, 'styles/base.css'), '/base.css')
])
const head = (
  <>
    <link href='/base.css' rel='stylesheet' />
  </>
)
const mongock = createReactmongock(__dirname, { files, head })
```

Please note that the submitted file will be publicly accessible.


## Using AVA

The test runner [AVA](https://github.com/avajs/ava) is quite popular for its lean and clean test API. You can easily write tests using mongock as well:

```js
import createReactmongock from '@mongock/react'
import Button from './button'

const mongock = createReactmongock(__dirname)

test.after(async () => {
  await mongock.finish()
})

test('Button', async t => {
  await Promise.all([
    mongock.snapshot('Default button', <Button label='Click me' />),
    mongock.snapshot('Primary button', <Button primary label='Click me' />)
  ])
  t.pass()
})
```
