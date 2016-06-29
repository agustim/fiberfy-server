'use strict'
/* global describe, it */

const assert = require('assert')

describe('Path Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Path'])
  })
})
