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
    const FootprintService = this.app.services.FootprintService

    request.body.user = request.user.id

    if (!request.body
      || !request.body.user
      || !request.body.project) {
      reply.json({flag: false, data: '', message: 'Error!'})
    }

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
    if (id) {
      response = FootprintService.find(this._Model(), { id,  user: request.user.id })
    }
    else {
      response = FootprintService.find(this._Model(), { user: request.user.id })
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

  createAssociation(request, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(request.query)
    FootprintService.createAssociation(request.params.parentModel, request.params.parentId, request.params.childAttribute, request.body, options)
      .then(elements => {
        res.status(200).json(elements || {})
      }).catch(error => {
        if (error.code == 'E_VALIDATION') {
          res.status(400).json(error)
        }
        else if (error.code == 'E_NOT_FOUND') {
          res.status(404).json(error)
        }
      else {
          res.boom.wrap(error)
        }
      })

  }

  findAssociation(request, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(request.query)
    const criteria = this.app.packs.express.getCriteriaFromQuery(request.query)
    const parentModel = request.params.parentModel
    const parentId = request.params.parentId
    const childAttribute = request.params.childAttribute
    const childId = request.params.childId
    let response
    if (childId) {
      response = FootprintService.findAssociation(parentModel,
        parentId, childAttribute, childId, options)
    }
    else {
      response = FootprintService.findAssociation(parentModel,
        parentId, childAttribute, criteria, options)
    }

    response.then(elements => {
      res.status(elements ? 200 : 404).json(elements || {})
    }).catch(error => {
      if (error.code == 'E_VALIDATION') {
        res.status(400).json(error)
      }
      else if (error.code == 'E_NOT_FOUND') {
        res.status(404).json(error)
      }
      else {
        res.boom.wrap(error)
      }
    })
  }

  updateAssociation(req, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(req.query)
    const criteria = this.app.packs.express.getCriteriaFromQuery(req.query)
    const parentModel = req.params.parentModel
    const parentId = req.params.parentId
    const childAttribute = req.params.childAttribute
    const childId = req.params.childId
    let response
    if (childId) {
      response = FootprintService.updateAssociation(parentModel,
        parentId, childAttribute, childId, req.body, options)
    }
    else {
      response = FootprintService.updateAssociation(parentModel,
        parentId, childAttribute, criteria, req.body, options)
    }

    response.then(elements => {
      res.status(200).json(elements || {})
    }).catch(error => {
      if (error.code == 'E_VALIDATION') {
        res.status(400).json(error)
      }
      else if (error.code == 'E_NOT_FOUND') {
        res.status(404).json(error)
      }
      else {
        res.boom.wrap(error)
      }
    })
  }

  destroyAssociation(req, res) {
    const FootprintService = this.app.services.FootprintService
    const options = this.app.packs.express.getOptionsFromQuery(req.query)
    const criteria = this.app.packs.express.getCriteriaFromQuery(req.query)
    const parentModel = req.params.parentModel
    const parentId = req.params.parentId
    const childAttribute = req.params.childAttribute
    const childId = req.params.childId
    let response
    if (childId) {
      response = FootprintService.destroyAssociation(parentModel,
        parentId, childAttribute, childId, options)
    }
    else {
      response = FootprintService.destroyAssociation(parentModel,
        parentId, childAttribute, criteria, options)
    }

    response.then(elements => {
      res.status(200).json(elements || {})
    }).catch(error => {
      if (error.code == 'E_VALIDATION') {
        res.status(400).json(error)
      }
      else if (error.code == 'E_NOT_FOUND') {
        res.status(404).json(error)
      }
      else {
        res.boom.wrap(error)
      }
    })
  }
}
