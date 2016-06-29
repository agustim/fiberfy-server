'use strict'
/* global describe, it */

const assert = require('assert')

describe('Project Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Project'])
  })
})
