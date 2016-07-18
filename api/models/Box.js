'use strict'

const Model = require('trails-model')

/**
 * @module Box
 * @description Box in a infraestructura
 */
module.exports = class Box extends Model {

  static config () {
  }

  static schema () {
    return {
      name: {
        type: 'string',
        unique: true
      },
      uuid: {
        type: 'string'
      },
      type: {
        type: 'string'
      },
      site: {
        model: 'site'
      },
      observations: {
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
