'use strict'
/* global describe, it */

const assert = require('assert')

describe('Site Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Site'])
  })
})
