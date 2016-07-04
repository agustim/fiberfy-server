'use strict'

const Controller = require('trails-controller')

/**
 * @module SiteController
 * @description Controller all interaction with Site.
 */
module.exports = class SiteController extends Controller{

  list (request, reply) {
    request.json({flag: false})
  }

}
