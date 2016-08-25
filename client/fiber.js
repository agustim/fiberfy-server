//=====================
// Tram
function Fiber(id, name, first_site, end_site, paths, colors, template, m){
  this.id = id;
  this.name = name;
  this.first_site = first_site;
  this.end_site = end_site;
  this.template = (!template) ? 0 : template;
  this.polyline = null;
  this.paths = paths;
  this.sites = [];
  this.colors = colors;
  this.color_building = "red";
  this.color_did = "blue";
  this.color_mouseover = "green";
  this.observations = null;

  this.map_parent = m;

  //Calcule sites
  if (this.paths.length > 0) {
    this.getSites();
  }

}
Fiber.prototype.setFirstSite = function(b){
  this.first_site = b.id;
  this.sites.push(b.id);
};
Fiber.prototype.setEndSite = function(b){
  this.end_site = b.id;
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
Fiber.prototype.changeTypeFiber = function(status, type) {
  this.polyline.setStyle( { color: this.findFiberColor(status, type) });
};

Fiber.prototype.findFiberColor = function(status, type) {
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
Fiber.prototype.clear = function() {
  this.map_parent.map.removeLayer(this.polyline);
};

Fiber.prototype.getSites = function() {

  var prePath = this.map_parent.getPath(this.paths[0]);
  for(var x = 1; x < this.paths.length; x++){
    var actPath = this.map_parent.getPath(this.paths[x]);
    if ((prePath.first_site == actPath.first_site) || (prePath.first_site == actPath.end_site)) {
      if (this.sites.length == 0){
        // Només pot passar la primer vegada
        this.sites.push(prePath.end_site);
      }
      if(prePath.first_site == actPath.end_site) {
        this.sites.push(actPath.end_site);
        if (x == this.paths.length - 1 ) this.sites.push(actPath.first_site);
      } else {
        this.sites.push(actPath.first_site);
        if (x == this.paths.length - 1 ) this.sites.push(actPath.end_site);
      }
    } else if ((prePath.end_site == actPath.first_site) || (prePath.end_site == actPath.end_site)) {
      if (this.sites.length == 0){
        // Només pot passar la primer vegada
        this.sites.push(prePath.first_site);
      }
      if(prePath.end_site == actPath.end_site) {
        this.sites.push(actPath.end_site);
        if (x == this.paths.length - 1 ) this.sites.push(actPath.first_site);
      } else {
        this.sites.push(actPath.first_site);
        if (x == this.paths.length - 1 ) this.sites.push(actPath.end_site);
      }
    } else {
      console.log("ERROR: Dos paths que no tene sits ens comú.");
      console.log(this);
    }
    prePath = actPath;
  }
};

Fiber.prototype.getAllDots = function() {
  var that = this;

  var dots = [];
  for(var x = 0; x < this.paths.length; x++){
    var actPath = this.map_parent.getPath(this.paths[x]);
    // Si el primer site del path actual, no és el site per numero
    // que toca s'han de guardar els punts al reves
    if (actPath.first_site == this.sites[x]) {
      for(var y = 0; y < actPath.dots.length; y++){
        var actDot = actPath.dots[y];
        if (dots.length == 0){
          dots.push(actDot);
        } else {
          // Mirem que no hi hagi el punt repetit!!
          var beforeDot = dots[dots.length - 1];
          if ((beforeDot.lat != actDot.lat) || (beforeDot.lng != actDot.lng)){
            dots.push(actDot);
          }
        }
      }
    } else {
      for(var y = actPath.dots.length - 1; y >= 0; y--){
        var actDot = actPath.dots[y];
        if (dots.length == 0){
          dots.push(actDot);
        } else {
          // Mirem que no hi hagi el punt repetit!!
          var beforeDot = dots[dots.length - 1];
          if ((beforeDot.lat != actDot.lat) || (beforeDot.lng != actDot.lng)){
            dots.push(actDot);
          }
        }
      }
    }
  }
  return dots;
};

Fiber.prototype.draw = function() {
  var that = this;
  // Pintar el Tram
  if (this.polyline) {
    this.clear();
  }

  var color = (this.end_site) ? this.findFiberColor() : this.findFiberColor('active');

  var dots = this.getAllDots();
  this.polyline = new L.Polyline(dots, {
      color: color,
      weight: 5,
      opacity: 0.5,
      smoothFactor: 1
  }).on('click', function(e) { return that.onFiberClick(e); })
    .on('mouseover', function(e) { return that.onFiberMouseOver(e); })
    .on('mouseout', function(e) { return that.onFiberMouseOut(e); })
    .addTo(this.map_parent.map);
};

Fiber.prototype.addPath = function(path) {
  if (!this.end_site){
    if(this.first_site) {
      console.log(path);
      this.paths.push(path);
      this.draw();
    } else {
      console.log("Els trams comencen a una caixa.");
    }
  } else {
    console.log("Aquest tram ja està tancat.");
  }
};
Fiber.prototype.addSite = function (site){
  var countBox = site.countBox();
  var lastSiteInFiber = this.sites[this.sites.length - 1];
  // Comprovar si existeix un path entre aquest dos sites!
  var pathBetween = this.map_parent.getPathBeetwenSites(lastSiteInFiber, site.id);

  // No  hi ha path entre aquest dos i no estem dient que ja estem a l'últim site!
  if ((!pathBetween)  && (lastSiteInFiber != site.id)) {
      console.log("Aquest site no està seguit de l'altre!!!");
      return;
  }
  if ((countBox > 0 ) && (lastSiteInFiber == site.id)){
    // Sí, és el final
    console.log('Tancar fibra.');
    this.setEndSite(site);
  } else {
    // No, només pot ser un intermig
    console.log('Intermedial site!');
    this.addPath(pathBetween);
    this.sites.push(site.id);
  }
};
Fiber.prototype.save = function (){
  var that = this;
  strUrl = this.map_parent.serverUrl + "/fiber";
  console.log('API call: ' + strUrl);
  console.log(this);
  if (this.first_site == null || this.end_site == null) {
    console.log("First or End site does not have id, please check this problem.");
    return;
  }
  $.post( strUrl, JSON.stringify({ "first": this.first_site, "last": this.end_site,
              "intermedial": JSON.stringify(this.paths), "project": this.map_parent.active_project.id,
              "type": this.type}))
    .done(function( data ) {
      that.id = data.id;
    }, "json");
};
Fiber.prototype.loadTypes = function(SelectField){
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
Fiber.prototype.updateForm = function (){
  var that = this;
  // Carraguem els caps del formulari al objecte

  this.name = $('#fiber-name').val();
  this.first_site = $('#fiber-first-site').val();
  this.end_site = $('#fiber-end-site').val();
  this.paths = $.parseJSON($('#fiber-intermedial').val());
  this.type = $('#fiber-type').val();
  try {
    this.colors = $.parseJSON($('#fiber-colors').val());
  } catch(err) {
    console.log(err);
  }
  this.observations = $('#fiber-observations').val();

  strUrl = this.map_parent.serverUrl + "/fiber/" + this.id;
  console.log('API call: ' + strUrl);
  if (this.first_site == null || this.end_site == null) {
    console.log("First or End site does not have id, please check this problem.");
    return;
  }
  // Not exist $.put need use $.ajax
  $.put( strUrl, JSON.stringify({ "name": this.name, "first": this.first_site, "last": this.end_site,
                                  "intermedial": JSON.stringify(this.paths) ,
                                  "colors": this.colors, "project": this.map_parent.active_project.id,
                                  "type": this.type,
                                  "observations": this.observations }))
    .done(function( data ) {
      that.map_parent.notify("Updated!");
      that.draw();
    }, "json");
};
Fiber.prototype.editForm = function() {
  var that = this;
  // Clear old click events.
  $('#fiber-update').unbind("click");

  // Carreguem les dades a on toqui
  $('#fiber-name').val(this.name);
  $('#fiber-first-site').val(this.first_site);
  $('#fiber-end-site').val(this.end_site);
  $('#fiber-intermedial').val(JSON.stringify(this.paths));
  $('#fiber-colors').val(JSON.stringify(this.colors));

  $('#fiber-observations').val(this.observations);
  $('#fiber-update').click(function(){ that.updateForm();});

  // Canviem de pàgina
  $('#map-group').hide();
  $('#zoom-fiber-group').toggleClass('hide');
};
Fiber.prototype.onFiberClick = function(e){
  var that = this;
  this.editForm();
};
Fiber.prototype.onFiberMouseOver = function(e) {
  if (this.map_parent.status != 'box') {
    this.map_parent.info.update('Fibra ' + this.name + '(' + this.id + ')');
    this.changeTypeFiber('over');
  }
};
Fiber.prototype.onFiberMouseOut = function(e) {
  if (this.map_parent.status != 'box') {
    this.map_parent.info.update('');
    this.changeTypeFiber();
  }
};

Fiber.prototype.distance = function (){
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
Fiber.prototype.getSegment = function (e){
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
module.exports = exports = Fiber;
