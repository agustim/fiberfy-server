var Box = require('./box');
var Path = require('./path');

//=====================
// Site

var Site = function(id, name, latlng, type, m){
  this.name = name;  // Nom del Lloc
  this.latlng = latlng; // Posició del Lloc
  this.id = id;  // Identificador
  this.type = type;  // Tipus de lloc
  this.status = 'create';
  this.observations = null;  // Observacions
  this.marker = null;  // Marcador en el mapa
  this.map_parent = m;  // referencia al mapa on està

  this.boxs = new Array(); // Coses que hi ha al site
  this.actualFusionSite = null;  // L'última grup de dades d'una fusió
};

Site.prototype.save = function (){
  var that = this;
  strUrl = this.map_parent.serverUrl + "/site";
  console.log('API call: ' + strUrl);
  if (this.id == 0 || this.id == null) {
    $.post( strUrl, JSON.stringify({ "name": this.name, "latitude": this.latlng.lat,
        "longitude": this.latlng.lng, "project": this.map_parent.active_project.id,
        "type" :this.type,
        "status": this.status}))
      .done(function( data ) {
        that.map_parent.notify("Updated!");
        that.id = data.id;
        that.changeTypeIcon();
      }, "json");
  } else {
    $.put( strUrl+"/"+this.id, JSON.stringify({ "name": this.name, "latitude": this.latlng.lat,
        "longitude": this.latlng.lng, "project": this.map_parent.active_project.id ,
        "type": this.type,
        "status": this.status,
        "observations" : this.observations }))
      .done(function( data ) {
        that.map_parent.notify("Updated!");
        that.changeTypeIcon();
      }, "json");
  }
};
Site.prototype.clear = function(){
  var that = this;
  this.map_parent.map.removeLayer(this.marker);
}

Site.prototype.draw = function (){
  var that = this;
  this.marker = L.marker(this.latlng)
                  .on('click', function() { return that.onSiteClick(); })
                  .on('mouseover', function() { return that.onSiteMouseOver(); })
                  .on('mouseout', function() { return that.onSiteMouseOut(); })
                  .addTo(that.map_parent.map);
  this.changeTypeIcon();
  if (!this.id)
    this.save();
};

Site.prototype.changeTypeIcon = function (status, type){
  if (!type) { type = this.type; }
  type = type.toLowerCase();

  var icon;
  switch( status ){
    case "over":
      icon = this.map_parent.type_site_icon_over[type];
      break;
    case "active":
      icon = this.map_parent.type_site_icon_active[type];
      break;
    case "grey":
      icon = this.map_parent.type_site_icon_grey[type];
      break;
    default:
      icon = (this.map_parent.layerActive == "civil") ? this.map_parent.type_site_icon[type] : this.map_parent.type_site_icon_grey[type];
  }
  this.marker.setIcon(icon);
};

Site.prototype.onSiteMouseOver = function (e){
  switch(this.map_parent.status) {
    case 'path':
      this.changeTypeIcon('active');
        break;
    default :
      this.map_parent.info.update('Site ' + this.name + '(' + this.id + ')');
      this.changeTypeIcon('over');
      $('#make_site').text('Edita Lloc');
      break;
  }
};
Site.prototype.onSiteMouseOut = function (e){
  switch(this.map_parent.status) {
    case 'path':
      if (((this.map_parent.active_path) && (this.map_parent.active_path.first_site) && (this.map_parent.active_path.first_site != this.id))
          || (!this.map_parent.active_path)){
        this.changeTypeIcon();
      }
      break;
    default :
      this.map_parent.info.update('');
      this.changeTypeIcon();
      $('#make_site').text('Crea Lloc');
      break;
  }
};
Site.prototype.onSiteClick = function (e){
  switch(this.map_parent.status){
    case "path":
      // Hi ha algun path actiu?
      if ((this.map_parent.active_path) && (this.map_parent.active_path.first_site)){
        // Sí
        console.log('tancar tram.');
        this.map_parent.active_path.setEndSite(this);
      } else {
        // No n'hi ha cap actiu, el creem.
        console.log('inici tram.');
        this.changeTypeIcon('active');
        this.map_parent.active_path = new Path(null, null, null, null, new Array(), this.map_parent.type_path_default, this.map_parent);
        this.map_parent.active_path.setFirstSite(this);
      }
      break;
    case "split":
      alert("No es pot fer un split a un Lloc!");
      break;
    case "site":
      // Anem a editar el site
      this.siteDefine();
      break;
    case "box":
      alert("Crea Box");
      break;
    }
};
// Pagina de Site
Site.prototype.siteDefine = function() {
  var that = this;

  if (!this.id) {
    alert("Aquesta caixa no ha estat grabada encarà!");
    return;
  }
  // Netejem events anteriors:
  $('#site-update').unbind("click");

  // Load formulari
  $('#site-name').val(this.name);
  $('#site-latitude').val(this.latlng.lat);
  $('#site-longitude').val(this.latlng.lng);
  $('#site-status').val(this.status);
  $('#site-observation').val(this.observations);
  this.loadTypes($('#site-type'));
  // El declarem events
  $('#site-update').on('click', function(e){
    that.name = $('#site-name').val();
    that.latlng = L.latLng($('#site-latitude').val(), $('#site-longitude').val());
    that.type = $('#site-type').val();
    that.status = $('#site-status').val();
    that.observations = $('#site-observation').val();
    that.save();
  });

  // Posem el ID d'aquest site al
  that.map_parent.active_site = that;
  // Amagar mapa.
  $('#map-group').hide();
  $('#zoom-site-group').toggleClass('hide');
};
Site.prototype.loadTypes = function(SelectField){
  var that = this;

  SelectField.find('option').remove().end();
  $.each(this.map_parent.type_site, function(key, value) {
    var option = $("<option></option>")
                    .attr("value",value)
                    .text(value);
    if (that.type == value) {
      option.attr("selected","selected");
    }
    SelectField.append(option);
  });
}
Site.prototype.deleteBox = function(uuid){
    //Buscar el box, i esborrar-lo
    box = this.boxs[uuid];
    if (box.id != 0)
      box.delete(box.id);
    else
      $('#box-'+ box.uuid).remove();
    delete this.boxs[uuid];
};

// Pagina de Definició de fusió
Site.prototype.siteFusion = function(){
  if (!this.id) {
    alert("Aquesta caixa no ha estat grabada encarà!");
    return;
  }
  // Amagar mapa.
  $('#map-group').hide();
  $('#zoom-site-fusion-group').toggleClass('hide');

  this.siteFusionPaint();
};
Site.prototype.siteFusionPaint = function() {
  // Carreguem dades.
  var that =  this;

  var global = $('<div>');
  // Carreguem les fusions
  var strUrlMerger = that.map_parent.serverUrl + "/site/" + that.id + "/merger";
  $.getJSON(strUrlMerger, function (dataMerger){
    // Carreguem les caixes.
    var strUrlSection = that.map_parent.serverUrl + "/site/" + that.id + "/section";
    $.getJSON(strUrlSection, function (dataSection) {
      // Insertem els boto per fusionar o la fusió que té.
      that.actualFusionSite = that.map_parent.buildSiteMerger(dataSection, dataMerger);
      console.log(that.actualFusionSite);
      var row = $('<div class="row">').appendTo(global);
      $.each(that.actualFusionSite, function (index, tram) {
        try {
          colors = $.parseJSON(tram.colors);
        } catch (e) {
          console.log(e);
          console.log(tram.colors);
        }
        var columns = $('<div class="col-s-3">').appendTo(row);
        var title_tram = $('<h1 title="' + tram.name + '">Del Tram ' + tram.id + '</h1>');
        title_tram.on('click', function(){
          that.map_parent.getPath(tram.id);
        });
        title_tram.appendTo(columns);
        var this_site = $('<ul>').appendTo(columns);
        if (colors) {
          $.each(colors, function (itub,tub){
              var this_tub = $(document.createElement("li")).text(tub.name);
              var this_fibers = $(document.createElement("ul"));
              $.each(tub.fibers, function (ifiber, fiber){
                var this_select_fusio;
                if (!fiber.fusionat){
                  // Creem les opcions d'aquell cable.
                  this_select_fusio = $(document.createElement('select')).attr('id', 'slct-' +  tram.id + "_" + tub.name + "_" + fiber.color).attr('class', 'select-fiber');
                  this_select_fusio.append($('<option>').text("").attr('value', ""));
                  $.each(tram.fusion_options, function(i, value) {
                    this_select_fusio.append($('<option>').text(value.label).attr('value', value.value));
                  });
                  this_select_fusio.on('change',function(e){ that.onChangeSelect(e); });
                } else {
                  this_remove_link = $('<a class="fusion-fiber">')
                                      .attr('data-input', tram.id + "_" + tub.name + "_" + fiber.color)
                                      .html("&nbsp;X&nbsp;");
                  this_select_fusio = $('<div class="input-group">')
                                      .append($('<input type="text" class="readonly">')
                                        .attr({'value':fiber.fusionat, 'id':tram.id + "_" + tub.name + "_" + fiber.color}))
                                      .append($('<span class=".input-group-addon .supplement input-close">')
                                        .append(this_remove_link)
                                      );
                 this_remove_link.on('click', function(e){ that.removeFusion(e); });
                }
                var row_line = $('<div class="row">');
                var col_line_Name = $('<div class="col-s-4">')
                    .append($('<input type="text" class="readonly">')
                      .attr('value',fiber.color))
                    .appendTo(row_line);
                var col_line_Fusio = $('<div class="col-s-8">').append(this_select_fusio).appendTo(row_line);
                var linea = row_line;
                this_fibers.append(linea);
              });
             this_site.append(this_tub).append(this_fibers);
          });
        }
      });
    });
  });
  // Netejem les caixes existents al mapa?
  $('.site-fusion').html("");
  global.appendTo($('.site-fusion'));
};
Site.prototype.onChangeSelect = function(e){
  strFFiber = new String(e.target.id).substr(5);
  strLFiber = $('#'+e.target.id).val();
  ffiber = strFFiber.split('_');
    lfiber = strLFiber.split('.');

    // Mirar de grabar la fusió
  var that = this;
  strUrl = this.map_parent.serverUrl + "/merger";
  console.log('API call: ' + strUrl);
  $.post( strUrl, JSON.stringify({ "site_id": that.id , "fsection_id": ffiber[0], "fcolor": ffiber[1]+"."+ffiber[2], "lsection_id": lfiber[0], "lcolor": lfiber[1]+"."+lfiber[2] }))
    .done(function( data ) {
      that.map_parent.notify("Updated!");
      myMerger = $.parseJSON( data );
      that.siteFusionPaint();
    }, "json");
    // Recarregar el Site
};
Site.prototype.removeFusion = function(e){
  strFFiber = $(e.target).data('input');
  strLFiber = $('#'+strFFiber).val();
  ffiber = strFFiber.split('_');
  lfiber = strLFiber.split('.');

  // Esborrar merge
  var that = this;
  strUrl = this.map_parent.serverUrl + "/merger";
  console.log('API call: ' + strUrl);
  $.delete( strUrl, JSON.stringify({ "site_id": that.id ,"fsection_id": ffiber[0], "fcolor": ffiber[1]+"."+ffiber[2], "lsection_id": lfiber[0], "lcolor": lfiber[1]+"."+lfiber[2] }))
    .done(function( data ) {
      that.map_parent.notify("Deleted!");
      myMerger = $.parseJSON( data );
      that.siteFusionPaint();
    }, "json");
  return false;
};
module.exports = exports = Site;
