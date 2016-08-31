'use strict'

const Controller = require('trails-controller')

/**
 * @module FusionController
 * @description Controller all interaction with Site.
 */
module.exports = class FusionController extends Controller{
  _Model() {
    return ('Fusion')
  }
  create(request, reply) {
    if (!request.body
      || !request.body.site) {
      reply.json({flag: false, data: '', message: 'Error!'})
      return
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
  destroyByParameters(request, reply) {
    const FootprintService = this.app.services.FootprintService
    const id = request.params.id
    this.log.debug('[',this.constructor.name,'] (destroy) model =',
      this._Model(), ', criteria =', request.query, request.user.username, request.user.id)

    let response

    request.body.user = request.user.id

    if (!request.body
      || !request.body.user
      || !request.body.project) {
      reply.status(500).json({flag: false, data: '', message: 'Error, you need pass some parameter if you\'ll want to remove registers'})
      return
    }

    response = FootprintService.destroy(this._Model(), request.body)

    response.then(elements => {
      if (elements == "" && request.body.ffiber && request.body.fcolor && request.body.lfiber && request.body.lcolor) {
        const ffiber = request.body.ffiber
        const fcolor = request.body.fcolor
        request.body.ffiber = request.body.lfiber
        request.body.fcolor = request.body.lcolor
        request.body.lfiber = ffiber
        request.body.lcolor = fcolor
        response = FootprintService.destroy(this._Model(), request.body)
        response.then(elements => {
          reply.status(200).json(elements || {})
          return
        })
      } else {
        reply.status(200).json(elements || {})
      }
    }).catch(error => {
      if (error.code == 'E_VALIDATION') {
        reply.status(400).json(error)
      }
      else if (error.code == 'E_NOT_FOUND') {
        reply.status(404).json(error)
      }
      else {
        reply.boom.wrap(error)
      }
    })
  /*
    // Only in special case in fusion why you don't know what is the first or last fiber.
    if (request.body.ffiber && request.body.fcolor && request.body.lfiber && request.body.lcolor) {
      const ffiber = request.body.ffiber
      const fcolor = request.body.fcolor
      request.body.ffiber = request.body.lfiber
      request.body.fcolor = request.body.lcolor
      request.body.lfiber = ffiber
      request.body.lcolor = fcolor
      response = FootprintService.destroy(model, request.body)
    }
*/

  }

}
