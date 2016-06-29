'use strict'

const Model = require('trails-model')

/**
 * @module User
 * @description Users in system
 */
module.exports = class User extends Model {

  static config () {
  }

  static schema () {
    return {
      username: {
        type: 'string'
      },
      projects: {
        collection: 'Project',
        via: 'user'
      }
    }
  }
}
