---
title: Vue Components
description: How to test Vue.js components.
permalink: /guides/vuew/index.html
toc: true
date: 2014-04-18 11:30:00
eleventyNavigation:
  order: 2 
---
# Vue Component Tests

[[toc]]

## Setup

First, install the necessary packages:

```bash
npm install --save-dev @mongock/vue vue
```

You will need to authenticate to the mongock service in order to use it. Check out the [section in the *Getting Started* guide](../getting-started#authentication) if you haven't yet.


## Write a test

Create a new test file for a Vue component of yours. There are no hard restrictions about how to name and where to put the test file. Just put it where you usually place your component tests and make sure your test runner (Jest, Mocha, ...) will find it.

Here is an example testing a `MyButton` component, using good old [Mocha](https://mochajs.org/) as the test runner.

```js
// src/components/MyButton.mongock.js

import createVuemongock from '@mongock/vue'
import MyButton from './MyButton'

const mongock = createVuemongock(__dirname)

describe('Button component', function () {
  after(async function () {
    // Collect and evaluate results once we are done
    await mongock.finish()
  })

  it('matches visual snapshot', async function () {
    await Promise.all([
      mongock.snapshot('Default Button', {
        components: { MyButton },
        template: '<my-button label='Click me'></my-button>'
      }),
      mongock.snapshot('Primary Button',  {
        components: { MyButton },
        template: '<my-button primary label='Click me'></my-button>'
      })
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

When running this test again, `@mongock/vue` will once more render your button and compare the resulting snapshots to your previous component snapshots. The tests will fail if the snapshots don't match, printing a list of the failed test cases and an inspection link.

The inspection link references the mongock web app where you can see the rendered components, the expected outcomes and a visual diff between them.

## CLI & Updating snapshots

First make sure the `mongock` package is installed:

```bash
$ npm install --save-dev mongock
```

Change your component, so that the new snapshot won't match the old one anymore. Run the tests and you will see an overview of the failed test cases.

What if this change was intentional? You want to update your locally stored snapshot(s), so the tests succeed again and future test runs will compare to the new visual appearance.

Let's update the snapshots using the `mongock` command line tool:

```bash
# `npx` comes with npm > 5.2 and will run mongock from ./node_modules/.bin/mongock
$ npx mongock update
```

You will see an interactive prompt that allows you to select the snapshots you want to update. Select them with Space and confirm with Enter, that's it.

<p class="text-center">
  <img alt="mongock CLI in action" src="/images/mongock-cli.png" style="max-width: 700px" />
</p>

If you need detailed usage information for the `mongock` command line tool, just run `npx mongock --help`.

## Custom <code>&lt;head&gt;</code>

The `<head>` section of the HTML document is easily customizable.

```js
import createVuemongock from '@mongock/vue'

const head = `
  <link href="/styles.css" rel="stylesheet" />
`

const mongock = createVuemongock(__dirname, { head })
```

## Submit local files

You can submit local files that will be served on a path of your choice while rendering. This way you can use custom stylesheets, for instance.

```js
import createVuemongock, { addFile } from '@mongock/vue'
import * as path from 'path'

const files = await Promise.all([
  addFile(path.join(__dirname, 'styles.css'), '/styles.css')
])
const head = `
  <link href="/styles.css" rel="stylesheet" />
`
const mongock = createVuemongock(__dirname, { files, head })
```

Please note that the submitted file will be publicly accessible.

## Using AVA

The test runner [AVA](https://github.com/avajs/ava) is quite popular for its lean and clean test API. You can easily write tests using mongock as well:

```js
import createVuemongock from '@mongock/vue'
import MyButton from './MyButton'

const mongock = createVuemongock(__dirname)

test.after(async () => {
  // Collect and evaluate results once we are done
  await mongock.finish()
})

test('Button', async t => {
  await Promise.all([
    mongock.snapshot('Default Button', {
      components: { MyButton },
      template: '<my-button label='Click me'></my-button>'
    }),
    mongock.snapshot('Primary Button',  {
      components: { MyButton },
      template: '<my-button primary label='Click me'></my-button>'
    })
  ])
  t.pass()
})
```

This is an example test using Vuetify components and [AVA](https://ava.li/) as the test runner.

```typescript
import test from 'ava'
import Vue from 'vue'
import Vuetify from 'vuetify'
import createVuemongock, { addFile } from '../src'

test('Vuetify components', async t => {
  Vue.use(Vuetify)
  const files = await Promise.all([
    addFile(require.resolve('vuetify/dist/vuetify.css'), '/vuetify.css')
  ])
  const head = `
    <link href="/vuetify.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons" rel="stylesheet" />
  `
  const mongock = createVuemongock(__dirname, { files, head })

  await mongock.snapshot('Vuetify button', {
    template: `<v-app>
      <v-btn>I am a button</v-btn>
    </v-app>`
  })

  await mongock.snapshot('Vuetify toolbar with content', {
    template: `<v-app>
      <v-toolbar>
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-toolbar-title>Title</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat>Link One</v-btn>
          <v-btn flat>Link Two</v-btn>
          <v-btn flat>Link Three</v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-app>`
  })

  await mongock.finish()
  t.pass()
})
```
