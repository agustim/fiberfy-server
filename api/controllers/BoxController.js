'use strict'

const Controller = require('trails-controller')

/**
 * @module BoxController
 * @description Controller all interaction with Site.
 */
module.exports = class BoxController extends Controller{
  _Model() {
    return ('Box')
  }
  create(request, reply) {
    if (!request.body
      || !request.body.site) {
      reply.json({flag: false, data: '', message: 'Error!'})
    }
    this.app.services.RestfulService.create(this._Model(), request, reply)
  }
  find(request, reply) {
    this.app.services.RestfulService.find(this._Model(), request, reply)
  }
  update(request, reply) {
    this.app.services.RestfulService.update(this._Model(), request, reply)
  }
  destroy(request, reply) {
    this.app.services.RestfulService.destroy(this._Model(), request, reply)
  }
}
