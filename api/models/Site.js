'use strict'

const Model = require('trails-model')

/**
 * @module Site
 * @description Site in a civil work
 */
module.exports = class Site extends Model {

  static config () {
  }

  static schema () {
    return {
      name: {
        type: 'string',
        unique: true
      },
      latitude: {
        type: 'float'
      },
      longitude: {
        type: 'float'
      },
      type: {
        type: 'string',
        sEnum: ['Arqueta', 'Poster', 'Cambra', 'Armari', 'Poe', 'Ganxo', 'Salt']
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
