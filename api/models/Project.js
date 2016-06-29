'use strict'

const Model = require('trails-model')

/**
 * @module Project
 * @description Workspace group by users
 */
module.exports = class Project extends Model {

  static config () {
  }

  static schema () {
    return {
      name: {
        type: 'string'
      },
      status: {
        type: 'string'
      },
      user: {
        model: 'User'
      }
    }
  }
}
