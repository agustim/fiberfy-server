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
        type: 'string'
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
      inputFO: {
        type: 'integer'
      },
      outputFO: {
        type: 'integer'
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
