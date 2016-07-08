'use strict'

const Controller = require('trails-controller')

/**
 * @module PathController
 * @description Generated Trails.js Controller.
 */
module.exports = class PathController extends Controller{

    _Model() {
      return('Path')
    }

    create(request, reply) {
      const FootprintService = this.app.services.FootprintService

      request.body.user = request.user.id
      this.log.info(request.body);

      if (!request.body
        || !request.body.user
        || !request.body.project) {
        reply.json({flag: false, data: '', message: 'Error!'})
      }
      this.log.debug('[',this.constructor.name,'] (create) model =',
        this._Model(), ', criteria =', request.query,
        ', values = ', request.body)

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

      const project = parseInt(request.query.project);
      const id = request.params.id

      let response

      let where =  { user: request.user.id }
      if (id) where.id = id
      if (project) where.project = project

      response = FootprintService.find(this._Model(), where)

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
      const FootprintService = this.app.services.FootprintService
      const id = request.params.id
      this.log.debug('[',this.constructor.name,'] (update) model =',
        this._Model(), ', criteria =', request.query, id,
        ', values = ', request.body)
      let response
      if (id) {
        response = FootprintService.update(this._Model(), { id,  user: request.user.id }, request.body)
      }
      else {
        response = FootprintService.update(this._Model(), { user: request.user.id } , request.body)
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

    destroy(request, reply) {
      const FootprintService = this.app.services.FootprintService
      const id = request.params.id
      this.log.debug('[',this.constructor.name,'] (destroy) model =',
        this._Model(), ', criteria =', request.query, id, request.user.username, request.user.id)
        let response
        if (id) {
      response = FootprintService.destroy(this._Model(),{ id,  user: request.user.id })
        }
        else {
      response = FootprintService.destroy(this._Model(), { user: request.user.id })
        }

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
