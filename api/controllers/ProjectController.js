'use strict'

const Controller = require('trails-controller')

/**
 * @module ProjectController
 * @description Controller for projects.
 */
module.exports = class ProjectController extends Controller{

  _Model() {
    return ('Project')
  }

  create(request, reply) {
    const FootprintService = this.app.services.FootprintService

    request.body.user = request.user.id

    FootprintService.create(this._Model(), request.body)
      .then(elements => {
        reply.status(200).json(elements || {})
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

  find(request, reply) {
    const FootprintService = this.app.services.FootprintService

    const id = request.params.id

    let response

    //let where =  { user: request.user.id }
    let where = {};
    if (id) where.id = id

    response = FootprintService.find(this._Model(), where)


    response.then(elements => {
      // Set readonly field, based in project.user != actual.user
      elements.forEach(function(e){
        e.readonly = (e.user != request.user.id)
      })
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

  update(request, reply) {
    const FootprintService = this.app.services.FootprintService
    const id = request.params.id
    this.log.debug('[ProjectController] (update) model =',
      this._Model(), ', criteria =', request.query, id,
      ', values = ', request.body)

    let response

    let where =  { user: request.user.id }
    if (id) where.id = id
    response = FootprintService.update(this._Model(), where , request.body)


    response.then(elements => {
      reply.status(200).json(elements || {})
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

  destroy(request, reply) {
    const FootprintService = this.app.services.FootprintService
    const id = request.params.id
    this.log.debug('[FootprintController] (destroy) model =',
      this._Model(), ', criteria =', request.query, id, request.user.username, request.user.id)

    let response

    let where =  { user: request.user.id }
    if (id) where.id = id
    response = FootprintService.destroy(this._Model(), where)

    this.log.debug(response)
    response.then(elements => {
      reply.status(200).json(elements || {})
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
