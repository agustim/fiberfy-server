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
      fbox: {
        type: 'Box'
      },
      fcolor: {
        type: 'integer'
      },
      lbox: {
        type: 'Box'
      },
      lcolor: {
        type: 'integer'
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
