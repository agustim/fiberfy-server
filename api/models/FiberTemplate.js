'use strict'

const Model = require('trails-model')

/**
 * @module FiberTemplate
 * @description FiberTemplate, examples of fibers
 */
module.exports = class FiberTemplate extends Model {

  static config () {
  }

  static schema () {
    return {
      name: {
        type: 'string'
      },
      colors: {
        type: 'string'
      }    
    }
  }
}
