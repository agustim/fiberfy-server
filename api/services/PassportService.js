'use strict'

const Service = require('trails-service')
/**
 * @module PassportService
 * @description All passport services
 */
module.exports = class PassportService extends Service {
  constructor(app) {
    super(app)
    this.protocols = require('./protocols')
    this.passport = require('passport')
  }
}

