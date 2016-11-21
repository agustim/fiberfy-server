
var GeoJSON = require('geojson');

function IOGeoJSON (m) {
  this.mapa = m;
}

IOGeoJSON.prototype.toGeoJSON = function() {

  $('#input-observation').val('');
  var data3 = [];
  for(var idx_site in this.mapa.sites){
    var s = this.mapa.sites[idx_site];
    data3.push({ 'lat': s.latlng.lat, 'lng': s.latlng.lng, 'tipus': s.type, 'status': s.status })
  }

  for(var idx_paths in this.mapa.paths){
    var p = this.mapa.paths[idx_paths];
    var p_line = [];
    for(var idx_polyline in p.dots){
      var latlng = p.dots[idx_polyline];
      p_line.push([ latlng.lng, latlng.lat ]);
    }
    data3.push({ 'polyline': p_line, 'tipus': p.type, 'stroke': p.findPathColor()})
  }

  $('#input-observation').val(JSON.stringify(data3,null,4));
  var export_info = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(GeoJSON.parse(data3, {'Point': ['lat', 'lng'], 'LineString': 'polyline'}), null, 4));
  $('#export-button').attr({
    download: 'export.geojson',
    href: export_info
  });
}

module.exports = exports = IOGeoJSON;
