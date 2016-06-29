//=====================
// Tram
function Path(id, name, first_site, end_site, dots, m){
  this.id = id
  this.name = name
  this.first_site = first_site
  this.end_site = end_site
  this.polyline = null
  this.dots = dots
  this.color_building = "red"
  this.color_did = "blue"
  this.color_mouseover = "green"
  this.colors = null
  this.observations = null

  this.map_parent = m
}
Path.prototype.setFirstSite = function(b){
  this.first_site = b.id;
  this.dots.push(b.latlng);
}
Path.prototype.setEndSite = function(b){
  this.end_site = b.id;
  this.dots.push(b.latlng);
  this.draw();
  this.map_parent.setIconInSiteById(this.first_site, this.map_parent.blueMarker);
  this.map_parent.setIconInSiteById(this.end_site, this.map_parent.blueMarker);
  this.map_parent.paths.push(this);
  this.map_parent.active_path = "";
  if (this.end_site != this.first_site) {
    this.save();
  } else {
    // Esborrar link
    this.clear();
  }
}
Path.prototype.clear = function() {
  this.map_parent.map.removeLayer(this.polyline);
}

Path.prototype.draw = function() {
  var that = this
  // Pintar el Tram
  if (this.polyline) {
    this.clear();
  }

  var color = (this.end_site) ? this.color_did : this.color_building

  this.polyline = new L.Polyline(this.dots, {
      color: color,
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1
  }).on('click', function(e) { return that.onPathClick(e) })
    .on('mouseover', function(e) { return that.onPathMouseOver(e) })
    .on('mouseout', function(e) { return that.onPathMouseOut(e) })
    .addTo(this.map_parent.map);
}
Path.prototype.addPoint = function(point) {
  if (!this.end_site){
    if(this.first_site) {
      this.dots.push(point);
      this.draw()
    } else {
      console.log("Els trams comencen a una caixa.")
    }
  } else {
    console.log("Aquest tram ja està tancat.")
  }
}
Path.prototype.save = function (){
  var that = this;
  strUrl = this.map_parent.serverUrl + "/api/v1/section"
  console.log('API call: ' + strUrl);
  if (this.first_site == null || this.end_site == null) {
    console.log("First or End site does not have id, please check this problem.");
    return;
  }
  $.post( strUrl, JSON.stringify({ "fsite_id": this.first_site, "lsite_id": this.end_site, "intermedial": this.dots }))
    .done(function( data ) {
      console.log( data );
      myPath = $.parseJSON( data );
      that.id = myPath.id;
    }, "json");
}
Path.prototype.updateForm = function (){
  var that = this;
  // Carraguem els caps del formulari al objecte

  this.name = $('#path-name').val();
  this.first_site = $('#path-first-site').val();
  this.end_site = $('#path-end-site').val();
  this.dots = $.parseJSON($('#path-intermedial').val());
  try {
    this.colors = $.parseJSON($('#path-colors').val());
  } catch(err) {
    console.log(err);
  }
  this.observations = $('#path-observations').val();

  strUrl = this.map_parent.serverUrl + "/api/v1/section/" + this.id
  console.log('API call: ' + strUrl);
  if (this.first_site == null || this.end_site == null) {
    console.log("First or End site does not have id, please check this problem.");
    return;
  }
  // Not exist $.put need use $.ajax
  $.put( strUrl, JSON.stringify({ "name": this.name, "fsite_id": this.first_site, "lsite_id": this.end_site, "intermedial": this.dots ,
                                  "colors": this.colors, "observations": this.observations }))
    .done(function( data ) {
      that.map_parent.notify("Updated!");
    }, "json");
}
Path.prototype.editForm = function() {
  var that = this
  // Clear old click events.
  $('#path-update').unbind("click");

  // Carreguem les dades a on toqui
  $('#path-name').val(this.name);
  $('#path-first-site').val(this.first_site);
  $('#path-end-site').val(this.end_site);
  $('#path-intermedial').val(JSON.stringify(this.dots));
  if (this.colors == null || this.colors == "") {
    $('#path-colors').val("");
  } else {
    $('#path-colors').val(JSON.stringify(this.colors));
  }
  // GUI Colors
  this.drawColors();
  $('#path-observations').val(this.observations);
  $('#path-update').click(function(){ that.updateForm();});

  // Canviem de pàgina
  $('#map-group').hide();
  $('#zoom-path-group').toggleClass('hide');
}
Path.prototype.onPathClick = function(e){
  var that = this;
  switch(this.map_parent.status){
    case "split":
      alert("Fer un split!");
      console.log(that);
      console.log(e);
      this.getSegment(e);
      break;
    default:
      this.editForm();
      break;
  }
}
Path.prototype.onPathMouseOver = function(e) {
  this.map_parent.info.update('Tram ' + this.name + '(' + this.id + ')');
  this.polyline.setStyle( { color: this.color_mouseover });
}
Path.prototype.onPathMouseOut = function(e) {
  this.map_parent.info.update('');
  this.polyline.setStyle( { color: this.color_did });
}

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
}
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
}
Path.prototype.drawColors = function (e) {
  var that = this;
  $('#div-path-colors').hide();

  $('#div-path-colors-gui').html("");

  if (this.colors) {
    $.each(this.colors, function (itub,tub){
        var label_tub = $('<label>').text("Tub")
        var label_colors = $('<label>').text("Fibres")
        var input_tub = $('<input class="tub-name" type="text" class="readonly">').attr('value',tub.name);
        var this_tub = $('<div class="row">')
                      .append($('<div class="col-s-12">')
                        .append($('<div class="row">')
                          .append($('<div class="col-s-1">')
                            .append(label_tub)
                          )
                          .append($('<div class="col-s-11">')
                            .append(input_tub)
                          )
                        )
                        .append($('<div class="row">')
                          .append($('<div class="col-s-1">')
                            .append(label_colors)
                          )
                        )
                      );
        var this_fibers = $('<div class="row">');

        input_tub.on('change', function(e) { that.onChangeTub(e, itub); } )

        $.each(tub.fibers, function (ifiber, fiber){
          var this_remove_link = $('<a>')
                              .html("X");
          var input_fiber = $('<input class="fiber-name" type="text" class="readonly">').attr('value',fiber.color);
          var col_line_Name = $('<div class="col-s-3">')
              .append($('<div class="input-group">')
                .append( input_fiber )
                .append($('<span class="input-group-addon supplement input-close">')
                  .append( this_remove_link )
                )
              )
          this_remove_link.on('click', function(e) { that.onRemoveFiber(e, itub, ifiber); } )
          input_fiber.on('change', function(e) { that.onChangeFiber(e, itub, ifiber); } )

          this_fibers.append(col_line_Name);
        })
        var add_fiber = $('<div class="col-s-3">')
                        .append($('<button>')
                          .text('Afegir fibra...')
                        );
        add_fiber.on('click', function(e){ that.onAddFiber(e,itub);})

        this_fibers.append(add_fiber);

        $('#div-path-colors-gui').append(this_tub).append(this_fibers)
    });
  }
  var add_tub = $('<div class="row">')
                .append($('<div class="col-s-12">')
                  .append($('<button>')
                    .text('Afegir tub...')
                  )
                );
  add_tub.on('click', function(e){ that.onAddTub(e); })
  $('#div-path-colors-gui').append(add_tub);

}
Path.prototype.onRemoveFiber = function(e, itub, ifiber) {
    var that = this
    delete that.colors[itub].fibers[ifiber];
    // delete mark item like "undefined", need clear array.
    that.colors[itub].fibers = $.grep(that.colors[itub].fibers,function(n){ return n == 0 || n });
    $('#path-colors').val(JSON.stringify(that.colors));
    that.drawColors();
    e.stopPropagation();
    return false;
}
Path.prototype.onChangeFiber = function(e, itub, ifiber) {
    var that = this
    that.colors[itub].fibers[ifiber].color =  $(e.currentTarget).val();
    $('#path-colors').val(JSON.stringify(that.colors));
    e.stopPropagation();
    return false;
}
Path.prototype.onChangeTub = function(e, itub) {
    var that = this
    that.colors[itub].name =  $(e.currentTarget).val();
    $('#path-colors').val(JSON.stringify(that.colors));
    e.stopPropagation();
    return false;
}
Path.prototype.onAddTub = function(e) {
  var that = this
  if (that.colors == null || that.colors == "") {
    that.colors = new Array({"name":"", "fibers":[]});
  } else {
    that.colors.push({"name":"", "fibers":[]});
  }
  $('#path-colors').val(JSON.stringify(that.colors));
  that.drawColors();
  e.stopPropagation();
  return false;
}
Path.prototype.onAddFiber = function(e, itub) {
  var that = this
  that.colors[itub].fibers.push({"color":""});
  $('#path-colors').val(JSON.stringify(that.colors));
  that.drawColors();
  e.stopPropagation();
  return false;
}
module.exports = exports = Path;
