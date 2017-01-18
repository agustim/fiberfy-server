// Internal modules
var Site = require('./site');
var Box = require('./box');
var Path = require('./path');
var Fiber = require('./fiber');
var Pfusion = require('./pfusion');
var Projecte = require('./projecte');
var Config = require('./config');
var IOGeoJSON = require('./iogeojson');
// requier leaflet-search
var LeafletSearch = require('leaflet-search');

//=====================
// Mapa
function Mapa(divMap){
  var that = this;
  this.attributionTiles = 'Guifi FO <a href="http://openstreetmap.org">&copy; OpenStreetMap</a>,<a href="http://maps.google.es">&copy; Google Maps</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
  this.tiles = [
    {
      'tiles' : 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'options' : {
         maxZoom: 20
       }
    },
    {
      'tiles' : '  http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      'options' : {
         maxZoom: 20,
         subdomains:['mt0','mt1','mt2','mt3']
      }
    },
    {
      'tiles' : '  http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      'options' : {
         maxZoom: 20,
         subdomains:['mt0','mt1','mt2','mt3']
      }
    },
    {
      'tiles' : '  http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      'options' : {
         maxZoom: 20,
         subdomains:['mt0','mt1','mt2','mt3']
      }
    },
    {
      'tiles' : '  http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      'options' : {
         maxZoom: 20,
         subdomains:['mt0','mt1','mt2','mt3']
      }
    }
  ];
  this.tilesIndex = 0;
  // create a tileLayer with the tiles, attribution
  this.serverUrl = "/api/v1";
  this.project_default_name = "default";
  this.project_default_latitude = 41.66060124302088;
  this.project_default_longitude = 1.571044921875;
  this.project_default_zoom = 8;

  // Llistat tancat? (TODO: Passar-ho a una taula.)
  this.type_site = ['Arqueta', 'Poste', 'Cambra', 'Armari', 'Poe', 'Ganxo', 'Salt'];
  this.type_site_icon = [];
  this.type_site_icon_over = [];
  this.type_site_icon_active = [];
  this.type_site_icon_grey = [];
  this.type_site_default = this.type_site[0];

  // Llistat tancat? (TODO: Passar-ho a una taula.)
  this.type_path = ['Aeri', 'Façana', 'Soterrat'];
  this.type_path_colors = [];
  this.type_path_colors['normal'] = [ "#000080", "#254117", "#806517"  ];
  this.type_path_colors['over']   = [ '#95b9c7','#99C68E', '#AF9B60' ];
  this.type_path_colors['active'] = [ '#357ec7','#7FE817', '#E8A317' ];
  this.type_path_colors['grey'] = [ '#2f2f2f', '#2f2f2f', '#2f2f2f' ];
  this.type_path_default = this.type_path[0];

  // Llistat de box (TODO: Passar-ho a una taula.)
  this.type_box = [ {"name":"Troncal", "in": 0, "out": 0} , {"name":"CTO", "in": 0, "out": 0}, {"name":"Splitter", "in": 1, "out": 5}, {"name":"PatchPanel", "in": 12, "out" : 12} ];
  this.type_box_default = this.type_box[0];

  // Llistat templates
  this.template_path = [ 'Not Update', 'Cable 6FO1T C1', 'Cable 6FO1T C2', 'Cable 12FO1T C1', 'Cable 48FO6T C1'];
  this.template_jsons = [ '',
  '[{"name":"black","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"}]}]',
  '[{"name":"black","fibers":[{"color":"green"},{"color":"red"},{"color":"blue"},{"color":"yellow"},{"color":"grey"},{"color":"purple"}]}]',
  '[{"name":"black","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"},{"color":"yellow"},{"color":"purple"},{"color":"pink"},{"color":"cyan"}]}]',
  '[{"name":"blue","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"orange","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"green","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"brown","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"grey","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]},{"name":"white","fibers":[{"color":"blue"},{"color":"orange"},{"color":"green"},{"color":"brown"},{"color":"grey"},{"color":"white"},{"color":"red"},{"color":"black"}]}]'];
  // Estatus
  // site
  // path
  // box
  // fibra
  // split ?

  this.status = "";


  //Input-Output
  this.ioMap = new IOGeoJSON(this);
  // Layer Active (civil, infra)
  this.layerActive = "civil";
  // Trams
  // Dibuixant en aquest moment.
  this.active_path = null;
  // Site actual
  this.active_site = null;
  // Dibuixant fibra
  this.active_fiber = null;

  // Active project
  this.active_project = null;

  // Llista de Trams fets al mapa.
  this.paths = new Array();

  // Llista de Site
  this.sites = new Array();

  // Llistat de fibres
  this.fibers = [];

  // Llista de Projectees de l'usuari
  this.projects = new Array();

  // Dibuix del Mapa
  this.map = L.map(divMap, {
    scrollWheelZoom: false
  });


// Declare new red Icon & blue icon.

  L.Icon.Default.imagePath = 'images';
  var RedIcon = L.Icon.extend({
     options: {
           iconUrl: L.Icon.Default.imagePath + '/red-marker-icon.png'
     }
  });
  var BlueIcon = L.Icon.extend({
    options: {
          iconUrl: L.Icon.Default.imagePath + '/marker-icon.png'
    }
  });
  var GreenIcon = L.Icon.extend({
    options: {
          iconUrl: L.Icon.Default.imagePath + '/green-marker-icon.png'
    }
  });

  this.redMarker = new RedIcon();
  this.blueMarker = new BlueIcon();
  this.greenMarker = new GreenIcon();


  // Carregar Icons dels sites.
  for(idx in this.type_site){
    var name = this.type_site[idx];
    name = name.toLowerCase();
    // Icon Base
    eval ("var " +  name + "Icon = L.Icon.extend({ options : { iconUrl: L.Icon.Default.imagePath +  '/" + name + ".png'}});");
    eval ("this.type_site_icon['" + name +"'] = new " + name +"Icon();");
    // Icon Over
    eval ("var " +  name + "OverIcon = L.Icon.extend({ options : { iconUrl: L.Icon.Default.imagePath +  '/" + name + ".over.png'}});");
    eval ("this.type_site_icon_over['" + name +"'] = new " + name +"OverIcon();");
    // Icon Active
    eval ("var " +  name + "ActiveIcon = L.Icon.extend({ options : { iconUrl: L.Icon.Default.imagePath +  '/" + name + ".active.png'}});");
    eval ("this.type_site_icon_active['" + name +"'] = new " + name +"ActiveIcon();");
    // Icon Grey
    eval ("var " +  name + "GreyIcon = L.Icon.extend({ options : { iconUrl: L.Icon.Default.imagePath +  '/" + name + ".grey.png'}});");
    eval ("this.type_site_icon_grey['" + name +"'] = new " + name +"GreyIcon();");
  }
  //console.log(this);

  // Search
  this.map.addControl( new LeafletSearch({
    url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
    jsonpParam: 'json_callback',
    propertyName: 'display_name',
    propertyLoc: ['lat','lon'],
    marker: L.circleMarker([0,0],{radius:30}),
    autoCollapse: true,
    autoType: false,
    minLength: 2
  }) );

  // Posicio inicial i zoom.

  this.map.setView(L.latLng(this.project_default_latitude,this.project_default_longitude), this.project_default_zoom);

  // Event de click
  this.map.on('click', function(e) { that.onClick(e); });

  this.tileLayer();

  // Info:
  this.info = L.control();

  this.info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  this.info.update = function (msg) {
    if (typeof msg != 'undefined')
      this._div.innerHTML = msg;

    if (msg != '')
      $(this._div).removeClass('hide');
    else
      $(this._div).addClass('hide');
};

  this.info.addTo(this.map);

  //Button - Declare events
  $('#make_section').click(function(){ that.clickMenu(this); that.makeSection(); });
  $('#make_site').click(function(){ that.clickMenu(this); that.makeSite(); });
  $('#split_path').click(function(){ that.clickMenu(this); that.makeSplit(); });
  $('#load').click(function(){ that.clickMenu(this); that.loadExternalMap(); });
  $('#debug').click(function(){ that.clickMenu(this); that.debugFunction(); });
  $('.tiles').click(function(){ that.rollTiles();})
  $('#input_output').click(function(){ that.inputOutput(); });

  $('#projects_manager').click(function(){ that.clickMenu(this); that.projectManager(); });
  $('#view_infrastructure').click(function() { that.changeMenu('infra'); });

  $('.back_map').click(function(){ that.clickMenu(this); that.backMap(); });
  $('.back_site').click(function(){ that.backSite(); });

  $('#fusion_graph').click(function(){ that.fusionSite(); });
  $('#back_fusion').click(function(){ that.backFusion(); });

  /* Menu d'infraestructura */
  $('#make_box').click(function(){ that.clickMenu(this); that.makeBox(); });
  $('#make_fiber').click(function(){ that.clickMenu(this); that.makeFiber(); });
  $('#view_obracivil').click(function() { that.changeMenu('civil'); });


  this.loadProjects();
}
Mapa.prototype.rollTiles = function(){
  this.tilesIndex = ( (this.tilesIndex + 1) % this.tiles.length);
  this.tileLayer(this.tiles[this.tilesIndex]);
}
Mapa.prototype.tileLayer = function(tiles){
  // add the tile layer to the map
  if (!tiles) {
    tiles = this.tiles[this.tilesIndex];
    tiles.options.attribution = this.attributionTiles;
  }

  this.layer = L.tileLayer(tiles.tiles, tiles.options);
  this.layer.addTo(this.map);
};

/* Project resouces */
Mapa.prototype.loadProjects = function (){
  var that = this;

  // Netejem l'array en cas de que hi hagi algo.
  this.projects = [];
  strUrl = that.serverUrl + "/project";
  $.getJSON(strUrl, function (data) {
    // Iterem
    $.each(data, function (index, value) {
      project = new Projecte(value.id, value.name, value.latitude, value.longitude, value.zoom, that);
      that.projects.push(project);
    });
    // Hi ha projecte actiu?
    if (!that.active_project){
      // No hi ha cap actiu, però tampoc té cap projecte, creem un per defecte.
      if (that.projects.length == 0){
        project = new Projecte(0, that.project_default_name , that.project_default_latitude,that.project_default_longitude, that.project_default_zoom, that);
        project.save();
        that.projects.push(project);
      }
      that.active_project = that.projects[0];
    }
    that.drawProjects();
    // Ara fem un "load", per què quan arribem aquí ja tenim projecte.
    if (that.active_project.id != 0){
      that.load();
    }
  });
};

Mapa.prototype.findProject = function(id) {
  var that = this;

  for(idx_project in that.projects){
    var value = that.projects[idx_project];
    if (value.id == id) {
      return value;
    }
  }
  return null;
};

Mapa.prototype.drawProjects = function (){
  var that = this;
  var addbutton = "#project-add";
  var addinput = "input[name=project-name]";
  var listprojects = "#list-projects";

  // Clean events
  $('.active-project-button').unbind("click");
  $('.delete-project-button').unbind("click");

  $(addbutton).unbind('click');
  // Print List
  var llista = $("<div id='project-list'>");
  $(listprojects).html(llista);
  $.each(that.projects, function(index,value){
    // És l'Actiu?
    var projectName = value.name;
    var buttonActiveProject = '';
    if (value.id == that.active_project.id) {
      projectName = "<label class='active'>" + projectName + "</label>";
      buttonActiveProject = "<label class='active'>Project Actived ";
      buttonActiveProject += '   <button class="position-project-button" id="position-project-' + value.id + '" data-id="' + value.id + '">Save Pos</button>';
      buttonActiveProject += '   <button class="report-project-button" id="report-project-' + value.id + '" data-id="' + value.id + '">Report</button>';
      buttonActiveProject += '   <button class="export-project-button" id="export-project-' + value.id + '" data-id="' + value.id + '">Export</button>';
      buttonActiveProject += '</label>' ;
    } else {
      buttonActiveProject = '<button class="active-project-button" id="active-project-' + value.id + '" data-id="' + value.id + '">Active</button>' +
                    '   <button class="delete-project-button" id="delete-project-' + value.id + '" data-id="' + value.id + '">Delete</button>' ;
    }
    var row = '<div class="row">' +
              ' <div class="col-s-6">' +
              '   <div class="project-item" id="project-' + value.id + '">' +
                    projectName +
              '   </div>' +
              ' </div>' +
              ' <div class="col-s-6">' +
              buttonActiveProject +
              ' </div>' +
              '</div>';
    llista.append(row);
  });
  $(addbutton).on('click', function(e) {
    var name = $(addinput).val();
    if (name != "") {
      var project = new Projecte(0, name,  that.project_default_latitude,that.project_default_longitude, that.project_default_zoom, that);
      project.save();
      that.projects.push(project);
      $(addinput).val("");
      that.drawProjects();
    } else {
      that.notify("Has de posar un nom de projecte!");
    }
  });
  $('.delete-project-button').on('click', function(e) {
    var project = that.findProject($('#'+e.target.id).data("id"));
    project.delete();
    that.loadProjects();
  });
  $('.active-project-button').on('click', function(e) {
    var project = that.findProject($('#'+e.target.id).data("id"));
    that.active_project = project;
    that.loadProjects();
  });
  $('.position-project-button').on('click', function(e) {
    var ll = that.map.getCenter();
    that.active_project.latitude = ll.lat;
    that.active_project.longitude = ll.lng;
    that.active_project.zoom = that.map.getZoom();
    that.active_project.save();
  });
  $('.report-project-button').on('click', function(e) {

  });
  $('.export-project-button').on('click', function(e) {

  });

};
/* End of Project resources */

Mapa.prototype.export = function(){
  var that =  this;
  // Exportar tots els sites
  for(var idx_site in this.sites){
    var s = this.sites[idx_site];
    console.log(s.marker.toGeoJSON());
  }

  // Exportar tots els paths
  for(var idx_paths in this.paths){
    var p = this.paths[idx_paths];
  }

  // Exportar totes les fibres
  for(var idx_fiber in this.fibers){
    var f = this.fibers[idx_fiber];
  }
}

Mapa.prototype.load = function (){
  var that =  this;
  // Netejem les caixes existents al mapa
  for(var idx_site in this.sites){
    var s = this.sites[idx_site];
    s.clear();
  }
  this.sites = [];

  // Netejem els paths existents al mapa
  for(var idx_paths in this.paths){
    var p = this.paths[idx_paths];
    p.clear();
  }
  this.paths = [];

  // Netejem les fibres existents al mapa
  for(var idx_fiber in this.fibers){
    var f = this.fibers[idx_fiber];
    f.clear();
  }
  this.fibers = [];


  // Carreguem les caixes.
  strUrl = that.serverUrl + "/site?project="+that.active_project.id;
  $.getJSON(strUrl, function (data) {
    $.each(data, function (index, value) {
      site = new Site(value.id, value.name, L.latLng(value.latitude, value.longitude), value.type, that);
      site.observations = value.observations;
      that.sites.push(site);
    });
    // Carreguem els trams.
    strUrl = that.serverUrl + "/path?project="+that.active_project.id;
    $.getJSON(strUrl, function (data) {
      $.each(data, function (index, value) {
        path = new Path(value.id, value.name, value.first, value.last, $.parseJSON(value.intermedial), value.type, that);
        path.observations = value.observations;
        that.paths.push(path);
      });
      // Carreguem les fibres
      strUrl = that.serverUrl + "/fiber?project="+that.active_project.id;
      $.getJSON(strUrl, function (data) {
        $.each(data, function (index, value) {
          path = new Fiber(value.id, value.name, value.first, value.last, $.parseJSON(value.intermedial), $.parseJSON(value.colors), value.template, that);
          path.observations = value.observations;
          that.fibers.push(path);
        });
      });
      // Posició del projecte.
      that.active_project.latitude = (that.active_project.latitude) ? that.active_project.latitude : that.project_default_latitude;
      that.active_project.longitude = (that.active_project.longitude) ? that.active_project.longitude : that.project_default_longitude;
      that.active_project.zoom = (that.active_project.zoom) ? that.active_project.zoom : that.project_default_zoom;

      that.map.setView(L.latLng( that.active_project.latitude , that.active_project.longitude ), that.active_project.zoom );
      that.clearLayers();
      that.redraw();
    });
  });
};
Mapa.prototype.loadInfra = function() {
  // Molt a saco, si hi han molts nodes!!!
  for(var idx_site in this.sites){
    var s = this.sites[idx_site];
    s.loadBoxes();
  }
};
Mapa.prototype.redraw = function(){
  // Tornem a posar el tileLayer
  this.tileLayer();
  // Pintem tots les caixes
  $.each( this.sites, function( index, site){
    site.draw();
  });
  $.each(this.paths, function( index, path){
    path.draw();
  });
};
Mapa.prototype.clearLayers = function() {
  // Seria interessant només esborrar aquells que son d'un tram.
  var that = this;
  this.map.eachLayer(function (layer) {
    that.map.removeLayer(layer);
  });
};

/* Canvi de menú entre infraestructura i obra civil */
Mapa.prototype.changeMenu = function(option) {
  switch (option){
    case 'infra':
      $('nav#civil').hide();
      $('nav#infra').removeClass('hide');
      this.loadInfra();
      break;
    case 'civil':
      $('nav#civil').show();
      $('nav#infra').addClass('hide');
      break;
  }
  this.layerActive = option;
  this.status = "";
  this.changeColor(option);
};

Mapa.prototype.changeColor = function(option) {
  var status = (option == "infra") ? "grey":"normal";
  // Canviem els color a tots els llocs.
  for(var idx_site in this.sites){
    var s = this.sites[idx_site];
    s.changeTypeIcon(status);
  }
  // Canviem els colors a tots els trams.
  for(var idx_paths in this.paths){
    var p = this.paths[idx_paths];
    p.changeTypePath(status);
  }

  // Pintem o esborrem la fibra tirada?
  for(var idx_fiber in this.fibers){
    var f = this.fibers[idx_fiber];
    if (option == 'civil') {
      f.clear();
    } else if (option == 'infra'){
      f.draw();
    }
  }
};

/* --- */

Mapa.prototype.clickMenu = function(divActive) {
  $('nav.menu li a').removeClass('active');
  divSelect = $(divActive);
  divSelect.addClass('active');
  $('.toggle-nav label').text(" "+divSelect.text());
  $('.menu ul').toggleClass('active');
};

Mapa.prototype.changeStatus = function(s, divActive){
  this.status = s;
};
Mapa.prototype.loadExternalMap = function() {
  var that = this;
  var track = new L.KML("/mapa/doc.kml", {async: true});
  that.info.update('Loading map');
  track.on("loaded", function(e) {
      that.map.fitBounds(e.target.getBounds());
      that.info.update('');
    });
  this.map.addLayer(track);
};
Mapa.prototype.debugFunction = function() {
  for(idx_path in this.paths){
    path = this.paths[idx_path];
    console.log(path.id + " " + path.distance());
  }
};
Mapa.prototype.backMap = function(){
  if (this.layerActive == 'infra') this.loadInfra();
  $('#map-group').show();
  $('.second-level').addClass('hide');
  $('.third-level').addClass('hide');
  Config.closeForm();

  this.changeStatus("","");
};
Mapa.prototype.backSite = function(){
  $('#zoom-path-group').addClass('hide');
  $('#zoom-site-fusion-group').addClass('hide');
  $('#zoom-fusion-graph-group').addClass('hide');
  if (this.layerActive == 'civil') {
    $('#zoom-site-group').removeClass('hide');
    $('#zoom-box-group').addClass('hide');
  } else {
    $('#zoom-site-group').addClass('hide');
    $('#zoom-box-group').removeClass('hide');
  }
  $('#form-project-group').addClass('hide');
  this.changeStatus("","");
};
Mapa.prototype.fusionSite = function(){
  $('#zoom-path-group').addClass('hide');
  $('#zoom-site-fusion-group').addClass('hide');
  $('#zoom-fusion-graph-group').removeClass('hide');
  $('#zoom-site-group').addClass('hide');
  $('#form-project-group').addClass('hide');
  this.changeStatus("","");
  var graph = new Pfusion($('#fusionGraph')[0],this.active_site);
  graph.draw();

};
Mapa.prototype.backFusion = function(){
  $('#zoom-path-group').addClass('hide');
  $('#zoom-site-fusion-group').removeClass('hide');
  $('#zoom-fusion-graph-group').addClass('hide');
  $('#zoom-site-group').addClass('hide');
  $('#form-project-group').addClass('hide');
  this.changeStatus("","");
};

Mapa.prototype.inputOutput = function(){
  var that = this
  that.ioMap.toGeoJSON();
  $('#map-group').hide();
  $('#zoom-path-group').addClass('hide');
  $('#zoom-site-fusion-group').addClass('hide');
  $('#zoom-fusion-graph-group').addClass('hide');
  $('#zoom-site-group').addClass('hide');
  $('#form-project-group').addClass('hide');
  this.changeStatus("","");
  $('#zoom-io-group').removeClass('hide');
};

Mapa.prototype.onClick = function(e) {
  switch (this.status){
    case "path":
      this.active_path.addPoint(e.latlng);
      break;
    case "site":
      var mysite = new Site(null,'site' + Math.floor(Math.random() * 1000), e.latlng, this.type_site_default, this);
      this.sites.push(mysite);
      mysite.draw();
      break;
    case "split":
      //alert("Només podem fer un split a un Tram.")
      break;
    default:
      //alert("status: '" + status + "' not exist!");
      break;
  }
};
Mapa.prototype.projectManager = function (){
  $('#map-group').hide();
  $('#form-project-group').removeClass('hide');
};
/* Obra civil */
Mapa.prototype.makeSection = function (){
  this.changeStatus("path", "#make_section");
};
Mapa.prototype.makeSite = function (){
  this.changeStatus("site", "#make_site");
};
Mapa.prototype.makeSplit = function (){
  this.changeStatus("split", "#split_path");
};

/* infraestructura */
Mapa.prototype.makeFiber = function (){
  this.changeStatus("fiber", "#make_fiber");
};
Mapa.prototype.makeBox = function (){
  this.changeStatus("box", "#make_box");
};

Mapa.prototype.getPathBeetwenSites = function(s1, s2){
  //Busquem a tots els paths  si hi ha algun que els sites coincideixen.
  for(var idx_paths in this.paths){
    var p = this.paths[idx_paths];
    if ((p.first_site == s1 && p.end_site == s2) || (p.first_site == s2 && p.end_site == s1))
     return p.id;
  }
  return null;
};
Mapa.prototype.convertBoxesInPatchs = function (Boxes){
  var siteFO = {};
  siteFO.colorsJSON = [];
  for(idx_box in Boxes){
    var box = Boxes[idx_box]
    switch(box.type.toLowerCase()){
      case "splitter":
      case "patchpanel":
        tmpColorsJSON = {};
        tmpColorsJSON.name = box.name;
        tmpColorsJSON.fibers = [];
        for(var intX=1; intX <= box.inputFO; intX++){
          tmpColorsJSON.fibers.push({"color": "in-"+intX});
        }
        for(var intX=1; intX <= box.outputFO; intX++){
          tmpColorsJSON.fibers.push({"color": "out-"+intX});
        }
        siteFO.colorsJSON .push(tmpColorsJSON);
        console.log(siteFO.colorsJSON);
        break;
    }
  }
  siteFO.colors = JSON.stringify(siteFO.colorsJSON);
  console.log(siteFO.colors);
  return(siteFO.colors);
}
Mapa.prototype.buildSiteMerger = function (Trams,Fusions,Boxes){
  // Bucle  per "Marcar" les fusions existents.
  this.convertBoxesInPatchs(Boxes);
  console.log(Trams);
  for(idx_tram in Trams){
    Tram = Trams[idx_tram];
    try {
      colors = $.parseJSON(Tram.colors);
    } catch (e) {
      console.log(e);
      console.log(Tram.colors);
    }
    for(idx_cable in colors){
      cable = colors[idx_cable];
      for(idx_fiber in cable.fibers){
        fiber = cable.fibers[idx_fiber];
        // Ja tenim una fibre ara li fem el seu llistat.
        // Validar que no te una fusió ja
        fusionat = existMerger ( Tram.id, cable.name, fiber.color, Fusions);
        if (fusionat != "") {
          fiber.fusionat = fusionat;
        }
        console.log(fiber)
      }
    }
    Trams[idx_tram].colors = JSON.stringify(colors);
  }
  //Bucle per calcular les opcions de fusió
  for(idx_tram_A in Trams){
    Tram_A = Trams[idx_tram_A];
    try {
      colors_A = $.parseJSON(Tram_A.colors);
    } catch (e) {
      console.log(e);
      console.log(Tram_A.colors);
    }
    var options_fiber = new Array();
    for(idx_tram_B in Trams){
      Tram_B = Trams[idx_tram_B];
      if (Tram_A.id != Tram_B.id){
        try {
          colors_B = $.parseJSON(Tram_B.colors);
        } catch (e) {
          console.log(e);
          console.log(Tram_B.colors);
        }
        for(idx_cable_B in colors_B){
          cable_B = colors_B[idx_cable_B];
          for(idx_fiber_B in cable_B.fibers){
            fiber_B = cable_B.fibers[idx_fiber_B];
            // Està fusionat ja aquesta fibra?
            // No, doncs la possem com a sel·leccionable.
            if (!fiber_B.fusionat){
              options_fiber.push({'label': Tram_B.id+"."+cable_B.name+"."+fiber_B.color, 'value': Tram_B.id+"."+cable_B.name+"."+fiber_B.color});
            }
          }
        }
      }
    }
    Trams[idx_tram_A].fusion_options = options_fiber;
  }
  console.log(Trams);
  return (Trams);
};
function existMerger(tram, tub, color, mergers){
  for(idx_merger in mergers){
    merger = mergers[idx_merger];
    if (merger.ffiber == tram && merger.fcolor == tub + "." + color)
      return merger.lfiber+"."+merger.lcolor;
    if (merger.lfiber == tram && merger.lcolor == tub + "." + color)
      return merger.ffiber+"."+merger.fcolor;
  }
  return "";
}
Mapa.prototype.havePaths = function (id){
  for(idx_path in this.paths){
    var path = this.paths[idx_path];
    if ( (path.first_site == id) || (path.end_site == id)){
      return true;
    }
  }
  return false;
}
Mapa.prototype.haveFibers = function (id){
  for(idx_fiber in this.fibers){
    var fiber = this.fibers[idx_fiber];
    if ( fiber.paths.indexOf(id) != -1){
      return true;
    }
  }
  return false;
}
Mapa.prototype.setIconInSiteById = function (id, status, type){
  for(idx_site in this.sites){
    site = this.sites[idx_site];
    if (site.id == id){
      site.changeTypeIcon(status, type);
      break;
    }
  }
};
Mapa.prototype.notify = function (text){
  $(".notify").text(text);
  setTimeout(function(){
    $(".notify").text("");
  }, 1000);
};
Mapa.prototype.getSite = function (id){
  for(idx_site in this.sites){
    site = this.sites[idx_site];
    if (site.id == id){
      return site;
    }
  }
  return null;
};
Mapa.prototype.getPath = function (id){
  for(idx_path in this.paths){
    path = this.paths[idx_path];
    if (path.id == id){
      return path;
    }
  }
  return null;
};
Mapa.prototype.deleteSiteById = function (id){
  for(idx_site in this.sites){
    site = this.sites[idx_site];
    if (site.id == id){
      delete this.sites[idx_site];
      break;
    }
  }
};
Mapa.prototype.deletePathById = function (id){
  for(idx_path in this.paths){
    path = this.paths[idx_path];
    if (path.id == id){
      delete this.paths[idx_path];
      break;
    }
  }
};
Mapa.prototype.deleteFiberById = function (id){
  for(idx_fiber in this.fibers){
    fiber = this.fibers[idx_fiber];
    if (fiber.id == id){
      delete this.fibers[idx_fiber];
      break;
    }
  }
};
//=====================
module.exports = exports = Mapa;
