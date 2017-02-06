'use strict'

const Controller = require('trails-controller')
const GeoJSON = require('geojson');

/**
 * @module InputOutputController
 * @description Controller .
 */
module.exports = class InputOutputController extends Controller {

  exports(request, reply) {
    // Recuperar projecte
    const FootprintService = this.app.services.FootprintService
    const stroke_colors = {'Aeri': '#000080', 'Façana': '#254117', 'Soterrat': '#806517'};

    const id = request.params.id

    let sites, paths
    let data_geojson = [];

    let where =  { user: request.user.id }
    if (id) where.project = id

    sites = FootprintService.find('Site', where)

    sites.then(elem_sites => {
      elem_sites.forEach(function(s) {
        data_geojson.push({ 'lat': s.latitude, 'lng': s.longitude, 'tipus': s.type, 'status': s.status });
      })
      paths = FootprintService.find('Path', where)
      paths.then(elem_paths => {
        elem_paths.forEach(function(p) {
          let p_line = [];
          let dots = JSON.parse(p.intermedial)
          dots.forEach(function(dot) {
            p_line.push([ dot.lng, dot.lat ])
          })
          let p_color = stroke_colors[p.type];
          data_geojson.push({ 'polyline': p_line, 'tipus': p.type, 'stroke': p_color})
        })
        let name = "fiber_" + id + ".json";
        reply.status(data_geojson ? 200 : 404).attachment(name).json(GeoJSON.parse(data_geojson, {'Point': ['lat', 'lng'], 'LineString': 'polyline'}) || {})
      })
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

    // Recuperar tots els sites d'un projecte
  }

  imports(request, reply) {

  }
}
