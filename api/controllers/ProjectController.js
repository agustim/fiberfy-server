'use strict'

const Controller = require('trails-controller')

/**
 * @module ProjectController
 * @description Controller for projects.
 */
module.exports = class ProjectController extends Controller{

  create(request, reply, res) {
    const Model = 'Project'
    const FootprintService = this.app.services.FootprintService

    request.body.user = request.user.id

    FootprintService.create(Model, request.body)
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
    const Model = 'Project'
    const FootprintService = this.app.services.FootprintService

    const id = request.params.id

    let response
    if (id) {
      response = FootprintService.find(Model, { id,  user: request.user.id })
    }
    else {
      response = FootprintService.find(Model, { user: request.user.id })
    }


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

  update(request, reply) {

    const Model = 'Project'
    const FootprintService = this.app.services.FootprintService
    const id = request.params.id
    this.log.debug('[FootprintController] (update) model =',
      Model, ', criteria =', request.query, id,
      ', values = ', request.body)
    let response
    if (id) {
      response = FootprintService.update(Model, { id,  user: request.user.id }, request.body)
    }
    else {
      response = FootprintService.update(Model, { user: request.user.id } , request.body)
    }

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
