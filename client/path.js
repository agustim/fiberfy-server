//=====================
// Tram
function Path(id, name, first_site, end_site, dots, type, m){
  this.id = id;
  this.name = name;
  this.first_site = first_site;
  this.end_site = end_site;
  this.type = (!type) ? m.type_path_default : type;
  this.polyline = null;
  this.dots = dots;
  this.color_building = "red";
  this.color_did = "blue";
  this.color_mouseover = "green";
  this.observations = null;

  this.map_parent = m;
}
Path.prototype.setFirstSite = function(b){
  this.first_site = b.id;
  this.dots.push(b.latlng);
};
Path.prototype.setEndSite = function(b){
  this.end_site = b.id;
  this.dots.push(b.latlng);
  this.draw();
  this.map_parent.setIconInSiteById(this.first_site);
  this.map_parent.setIconInSiteById(this.end_site);
  this.map_parent.paths.push(this);
  this.map_parent.active_path = "";
  if (this.end_site != this.first_site) {
    this.save();
  } else {
    // Esborrar link
    this.clear();
  }
};
Path.prototype.changeTypePath = function(status, type) {
  this.polyline.setStyle( { color: this.findPathColor(status, type) });
};
Path.prototype.findPathColor = function(status, type) {
  if (!type) type = this.type;
  if (!type) type = this.map_parent.type_path_default;
  type_idx = this.map_parent.type_path.indexOf(type);

  var color;
  switch( status ){
    case "over":
    case "active":
    case "grey":
      color = this.map_parent.type_path_colors[status][type_idx];
      break;
    default:
      color = (this.map_parent.layerActive == 'civil') ? this.map_parent.type_path_colors['normal'][type_idx] : this.map_parent.type_path_colors['grey'][type_idx];
  }
  return color;
};
Path.prototype.remove = function(){
  var that = this;
  strUrl = this.map_parent.serverUrl + "/path";
  console.log('API call: ' + strUrl);
  $.delete( strUrl+"/"+this.id)
    .done(function( data ) {
      that.clear();
      that.map_parent.backMap();
      that.map_parent.notify("Path deleted!");
      that.map_parent.deletePathById(that.id);
    }, "json");
}
Path.prototype.delete = function() {
  if (!this.map_parent.haveFibers(this.id)){
    //This path has not any fibers. We can delete.
    this.remove();
  } else {
    alert('It is not possible. This path has fibers.');
  }
}
Path.prototype.clear = function() {
  if (this.polyline)
    this.map_parent.map.removeLayer(this.polyline);
};

Path.prototype.draw = function() {
  var that = this;
  // Pintar el Tram
  if (this.polyline) {
    this.clear();
  }

  var color = (this.end_site) ? this.findPathColor() : this.findPathColor('active');

  this.polyline = new L.Polyline(this.dots, {
      color: color,
      weight: 5,
      opacity: 0.5,
      smoothFactor: 1
  }).on('click', function(e) { return that.onPathClick(e); })
    .on('mouseover', function(e) { return that.onPathMouseOver(e); })
    .on('mouseout', function(e) { return that.onPathMouseOut(e); })
    .addTo(this.map_parent.map);

};
Path.prototype.addPoint = function(point) {
  if (!this.end_site){
    if(this.first_site) {
      this.dots.push(point);
      this.draw();
    } else {
      console.log("Els trams comencen a una caixa.");
    }
  } else {
    console.log("Aquest tram ja està tancat.");
  }
};
Path.prototype.save = function (){
  var that = this;
  strUrl = this.map_parent.serverUrl + "/path";
  console.log('API call: ' + strUrl);
  if (this.first_site == null || this.end_site == null) {
    console.log("First or End site does not have id, please check this problem.");
    return;
  }
  $.post( strUrl, JSON.stringify({ "first": this.first_site, "last": this.end_site,
              "intermedial": JSON.stringify(this.dots), "project": this.map_parent.active_project.id,
              "type": this.type}))
    .done(function( data ) {
      that.id = data.id;
    }, "json")
    .fail(function( data ) {
      that.clear();
      that.map_parent.deletePathById(that.id);
      alert("There was a problem. Please, try again.");
    });
};
Path.prototype.loadTypes = function(SelectField){
  var that = this;

  SelectField.find('option').remove().end();
  $.each(this.map_parent.type_path, function(key, value) {
    var option = $("<option></option>")
                    .attr("value",value)
                    .text(value);
    if (that.type == value) {
      option.attr("selected","selected");
    }
    SelectField.append(option);
  });
};
Path.prototype.updateForm = function (){
  var that = this;
  // Carraguem els caps del formulari al objecte  $('#site-delete').unbind("click");

  this.name = $('#path-name').val();
  this.first_site = $('#path-first-site').val();
  this.end_site = $('#path-end-site').val();
  this.dots = $.parseJSON($('#path-intermedial').val());
  this.type = $('#path-type').val();
  try {
    this.colors = $.parseJSON($('#path-colors').val());
  } catch(err) {
    console.log(err);
  }
  this.observations = $('#path-observations').val();

  strUrl = this.map_parent.serverUrl + "/path/" + this.id;
  console.log('API call: ' + strUrl);
  if (this.first_site == null || this.end_site == null) {
    console.log("First or End site does not have id, please check this problem.");
    return;
  }
  // Not exist $.put need use $.ajax
  $.put( strUrl, JSON.stringify({ "name": this.name, "first": this.first_site, "last": this.end_site,
                                  "intermedial": JSON.stringify(this.dots) ,
                                  "colors": this.colors, "project": this.map_parent.active_project.id,
                                  "type": this.type,
                                  "observations": this.observations }))
    .done(function( data ) {
      that.map_parent.notify("Updated!");
      that.draw();
    }, "json")
    .fail(function( data ) {
      that.clear();
      that.map_parent.deletePathById(that.id);
      alert("There was a problem. Please, try again.");
    });
};
Path.prototype.editForm = function() {
  var that = this;
  // Clear old click events.
  $('#path-update').unbind("click");
  $('#path-delete').unbind("click");

  // Carreguem les dades a on toqui
  $('#path-name').val(this.name);
  $('#path-first-site').val(this.first_site);
  $('#path-end-site').val(this.end_site);
  $('#path-intermedial').val(JSON.stringify(this.dots));

  $('#path-observations').val(this.observations);
  // Update
  $('#path-update').click(function(){ that.updateForm();});
  // Delete
  $('#path-delete').on('click', function(e){
    //Check if this path have fibers.
    if (that)
    that.delete();
  });
  this.loadTypes($('#path-type'));
  // Canviem de pàgina
  $('#map-group').hide();
  $('#zoom-path-group').toggleClass('hide');
};
Path.prototype.onPathClick = function(e){
  var that = this;
  switch(this.map_parent.status){
    case "split":
      alert("Fer un split!");
      console.log(that);
      console.log(e);
      this.getSegment(e);
      break;
    case "path":
    case "site":
      this.editForm();
      break;
    case "box":
      break;
    case "fiber":
      //this.map_parent.active_fiber.addPath(this.id);
      console.log(this.map_parent.active_fiber.paths);
      break;
  }
};
Path.prototype.onPathMouseOver = function(e) {
  if (this.map_parent.status == 'path') {
    this.map_parent.info.update('Tram ' + this.name + '(' + this.id + ')');
    this.changeTypePath('over');
  }
};
Path.prototype.onPathMouseOut = function(e) {
  if (this.map_parent.status == 'path') {
    this.map_parent.info.update('');
    this.changeTypePath();
  }
};

Path.prototype.distance = function (){
  var metros_totales_ruta = 0;
  var coordenadas_iniciales = null;
  var array_coordenadas_polilinea = this.polyline._latlngs;

  for (i = 0; i < array_coordenadas_polilinea.length - 1; i++) {
      coordenadas_iniciales = array_coordenadas_polilinea[i];
      metros_totales_ruta  += coordenadas_iniciales.distanceTo(array_coordenadas_polilinea[i + 1]);
  }
  metros_totales_ruta = metros_totales_ruta.toFixed();
  return metros_totales_ruta;
};
Path.prototype.getSegment = function (e){
/* This not working yet!! need i will work more
  var point = e.layerPoint;

  var points = this.polyline._originalPoints;
  var min_distance = L.LineUtil.pointToSegmentDistance(point, points[0], points[1]);
  for ( var i = 0; i < points.length; i++ ) {
    if ( i < points.length - 2 ) {
      if (min_distance > L.LineUtil.pointToSegmentDistance(point, points[i], points[ i + 1]) ) {
        min_distance = L.LineUtil.pointToSegmentDistance( point, points[i], points[ i + 1] );
        min_offset = i;
      }
    }
    console.log("---");
    console.log(point, points[i], points[ i + 1]);
    console.log(min_distance);
  }
*/
console.log("");
};
module.exports = exports = Path;
