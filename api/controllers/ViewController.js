'use strict'

const Controller = require('trails-controller')

module.exports = class ViewController extends Controller {

  index (request, reply) {
    reply.render('index',{})
  }

  map (request, reply) {
    reply.render('map', {'cache': false})
  }
}
