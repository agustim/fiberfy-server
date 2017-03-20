'use strict'

const Service = require('trails-service')

/**
 * @module RestfulService
 *
 * @description "Special" object to restfulService with user and project.
 * @this
 */
module.exports = class RestfulService extends Service {

  create(model, request, reply) {


    this.log.debug('[',this.constructor.name,'] (create) model =',
      model, ', criteria =', request.query,
      ', values = ', request.body)

    request.body.user = request.user.id

    let that = this

    if (!request.body
      || !request.body.user
      || !request.body.project) {
      reply.json({flag: false, data: '', message: 'Error!'})
      return
    }

    this.security(model, request, reply, 'create', request.user.id, request.body.project, function(model,request,reply) {
      const FootprintService = that.app.services.FootprintService

      FootprintService.create(model, request.body)
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
      })
  }

  find(model, request, reply) {
    const FootprintService = this.app.services.FootprintService

    const project = parseInt(request.query.project)
    const id = request.params.id

    this.log.debug('[',this.constructor.name,'] (find) model =',
      model, ', criteria =', request.query, id,
      ', values = ', request.body)

    let response

    //let where =  { user: request.user.id }
    let where = {}
    if (id) where.id = id
    if (project) where.project = project

    response = FootprintService.find(model, where)

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

  update(model, request, reply) {

    const id = request.params.id
    this.log.debug('[',this.constructor.name,'] (update) model =',
      model, ', criteria =', request.query, id,
      ', values = ', request.body)
    let response

    let that = this
    this.security(model, request, reply, 'update', request.user.id, request.body.project, function(model,request,reply) {
      let where =  { user: request.user.id }
      if (id) where.id = id

      const FootprintService = that.app.services.FootprintService
      response = FootprintService.update(model, where , request.body)

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
    })
  }

  destroy(model, request, reply) {

    const id = request.params.id
    this.log.debug('[',this.constructor.name,'] (destroy) model =',
      model, ', criteria =', request.query, id, request.user.username, request.user.id)

    let response

    let that = this

    const FootprintService = this.app.services.FootprintService
    let where =  { user: request.user.id }
    if (!id) {
      reply.status(500).json({flag: false, data: '', message: 'Error, you can not remove without id.'})
      return
    }

    where.id = id
    
    response = FootprintService.destroy(model, where)

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

  security(model, request, reply, action, user_id, project_id, callback){
    //const FootprintService = this.app.services.FootprintService

    this.log.debug('[Securiy] () model =',
      model, ', action =', action, ', user = ', user_id,
      ', project = ', project_id)


    // Now simple, (only owner can write, other people can read)
    let response

    //let where =  { user: request.user.id }
    let where =  { id: project_id }

    response = this.app.services.FootprintService.find('Project', where)

    response.then(elements => {
      if (elements['0'].user == user_id) callback(model, request, reply);
      else reply.status(403).json(error)
    }).catch(error => {
      reply.status(402).json(error)
    })
  }
}
