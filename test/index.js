'use strict'

import test from 'ava'
import vl from './../index.js'

test(`returns array of video elements`, async (assert) => {
  assert.true(Array.isArray(await vl()))
})
