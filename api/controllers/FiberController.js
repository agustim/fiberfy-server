'use strict'

const Controller = require('trails-controller')

/**
 * @module FiberController
 * @description Generated Trails.js Controller.
 */
module.exports = class FiberController extends Controller{
  _Model() {
    return ('Fiber')
  }
  create(request, reply) {
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
