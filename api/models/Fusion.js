'use strict'

const Model = require('trails-model')

/**
 * @module Fusion
 * @description Workspace group by users
 */
module.exports = class Fusion extends Model {

  static config () {
  }

  static schema () {
    return {
      site: {
        model: 'Site'
      },
      ffiber: {
        model: 'Fiber'
      },
      fcolor: {
        type: 'string'
      },
      lfiber: {
        model: 'Fiber'
      },
      lcolor: {
        type: 'string'
      },
      status: {
        type: 'string'
      },
      user: {
        model: 'User'
      },
      project: {
        model: 'Project'
      }
    }
  }
}
