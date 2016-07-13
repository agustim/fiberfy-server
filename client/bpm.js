// Internal modules
var Site = require('./site');
var Box = require('./box');
var Path = require('./path');
var Pfusion = require('./pfusion');
var Project = require('./project');
var Config = require('./config');

//=====================
// Mapa
function Mapa(divMap){
  var that = this;
  this.attribution = 'Guifi FO <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
  // create a tileLayer with the tiles, attribution
  this.tiles = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  this.serverUrl = "/api/v1";
  this.project_default_name = "default";

  // Llistat tancat? (TODO: Passar-ho a una taula.)
  this.type_site = ['Arqueta', 'Poster', 'Cambra', 'Armari', 'Poe', 'Ganxo', 'Salt'];
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
  this.type_path_colors['grey'] = [ '#2f2f2f', '#2f2f2f', '#2f2f2f' ]
  this.type_path_default = this.type_path[0];

  // Llistat de box (TODO: Passar-ho a una taula.)
  this.type_box = [ "caixa", "switch" ];
  this.type_box_default = this.type_box[0];
  // Estatus
  // site
  // path
  // box
  // fibra
  // split ?

  this.status = "";

  // Layer Active (civil, infra)
  this.layerActive = "civil";
  // Trams
  // Dibuixant en aquest moment.
  this.active_path = null;
  // Site actual
  this.active_site = null;

  // Active project
  this.active_project = null;

  // Llista de Trams fets al mapa.
  this.paths = new Array();

  // Llista de Site
  this.sites = new Array();

  // Llista de Projectes de l'usuari
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
  console.log(this);
  // Posicio inicial i zoom.
  this.map.setView([41.412, 2.15353], 17);

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

  $('#projects_manager').click(function(){ that.clickMenu(this); that.projectManager(); });
  $('#view_infrastructure').click(function() { that.changeMenu('infra'); })

  $('.back_map').click(function(){ that.clickMenu(this); that.backMap(); });
  $('.back_site').click(function(){ that.backSite(); });
  $('#fusion_graph').click(function(){ that.fusionSite(); });
  $('#back_fusion').click(function(){ that.backFusion(); });

  /* Menu d'infraestructura */
  $('#make_box').click(function(){ that.clickMenu(this); that.makeBox(); });
  $('#make_fiber').click(function(){ that.clickMenu(this); that.makeFiber(); });
  $('#view_obracivil').click(function() { that.changeMenu('civil'); })


  this.loadProjects();
}
Mapa.prototype.tileLayer = function(){
  // add the tile layer to the map
  this.layer = L.tileLayer(this.tiles, {
      maxZoom: 19,
      attribution: this.attribution
    });
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
      project = new Project(value.id, value.name, that);
      that.projects.push(project);
    });
    // Hi ha projecte actiu?
    if (!that.active_project){
      // No hi ha cap actiu, però tampoc té cap projecte, creem un per defecte.
      if (that.projects.length == 0){
        project = new Project(0, that.project_default_name , that);
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
}

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
      buttonActiveProject = "<label class='active'>Project Actived</label>";
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
      var project = new Project(0, name, that);
      project.save();
      that.projects.push(project);
      $(addinput).val("");
      that.drawProjects();
    } else {
      that.notify("Has de posar un nom de projecte!");
    }
  })
  $('.delete-project-button').on('click', function(e) {
    var project = that.findProject($('#'+e.target.id).data("id"));
    project.delete();
    that.loadProjects();
  })
  $('.active-project-button').on('click', function(e) {
    var project = that.findProject($('#'+e.target.id).data("id"));
    that.active_project = project;
    that.loadProjects();
  })
};
/* End of Project resources */

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

  // Carreguem les caixes.
  strUrl = that.serverUrl + "/site?project="+that.active_project.id;
  $.getJSON(strUrl, function (data) {
    // Iterem
    $.each(data, function (index, value) {
      site = new Site(value.id, value.name, L.latLng(value.latitude, value.longitude), value.type, that);
      site.observations = value.observations;
      that.sites.push(site);
    });
    // Carreguem els trams.
    strUrl = that.serverUrl + "/path?project="+that.active_project.id;
    $.getJSON(strUrl, function (data) {
      // Iterem
      $.each(data, function (index, value) {
        path = new Path(value.id, value.name, value.first, value.last, $.parseJSON(value.intermedial), value.type, that);
        path.observations = value.observations;
        that.paths.push(path);
      });
      that.clearLayers();
      that.redraw();
    });
  });

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
      break;
    case 'civil':
      $('nav#civil').show();
      $('nav#infra').addClass('hide');
      break;
  }
  this.layerActive = option;
  this.changeColor(option);
}

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
}

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
  $('#zoom-site-group').removeClass('hide');
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
Mapa.prototype.buildSiteMerger = function (Trams,Fusions){
  // Bucle  per "Marcar" les fusions existents.
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
  return (Trams);
};
function existMerger(tram, tub, color, mergers){
  for(idx_merger in mergers){
    merger = mergers[idx_merger];
    if (merger.fsectionId == tram && merger.fcolor == tub + "." + color)
      return merger.lsectionId+"."+merger.lcolor;
    if (merger.lsectionId == tram && merger.lcolor == tub + "." + color)
      return merger.fsectionId+"."+merger.fcolor;
  }
  return "";
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
Mapa.prototype.getPath = function (id){
  for(idx_path in this.paths){
    path = this.paths[idx_path];
    if (path.id == id){
      return path;
    }
  }
};
//=====================
module.exports = exports = Mapa;
