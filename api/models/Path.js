'use strict'

const Model = require('trails-model')

/**
 * @module Path
 * @description Path between Site in a civil work
 */
module.exports = class Path extends Model {

  static config () {
  }

  static schema () {
    return {
      name: {
        type: 'string'
      },
      first: {
        model: 'Site'
      },
      last: {
        model: 'Site'
      },
      path: {
        type: 'string'
      },
      type: {
        type: 'string',
        sEnum: ['Aeri', 'Façana', 'Soterrat']
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
