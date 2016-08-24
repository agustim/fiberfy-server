'use strict'

const Controller = require('trails-controller')

/**
 * @module PathController
 * @description Generated Trails.js Controller.
 */
module.exports = class PathController extends Controller{
  _Model() {
    return ('Path')
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
