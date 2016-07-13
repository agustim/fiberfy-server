'use strict'

const Controller = require('trails-controller')

/**
 * @module SiteController
 * @description Controller all interaction with Site.
 */
module.exports = class SiteController extends Controller{
  _Model() {
    return('Site')
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
  getBoxes(request, reply) {
    const FootprintService = this.app.services.FootprintService

    const id = request.params.id

    this.log.debug('[',this.constructor.name,'] (find) model =',
      'box', ', criteria =', request.query, id,
      ', values = ', request.body)

    let response

    let where =  { user: request.user.id }
    if (id) where.site = id

    response = FootprintService.find('Box', where)

    response.then(elements => {
      reply.status(elements ? 200 : 404).json(elements || {})
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
  }
}
