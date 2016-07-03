'use strict'

const Model = require('trails-model')

/**
 * @module User
 * @description Users in system
 */
module.exports = class User extends Model {

  static config () {
    return {
      schema: {
      },
      methods: {
        toJSON: function () {
          const model = this.toObject()
          delete model.password
          return model
        }
      }
    }
  }

  static schema () {
    return {
      username: {
        type: 'string',
        unique: true
      },
      password: {
        type: 'string'
      },
      projects: {
        collection: 'Project',
        via: 'user'
      }
    }
  }
}
