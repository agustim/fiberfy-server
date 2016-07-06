
//=====================
// Project

var Project = function(id, name, m){
  this.id = id;
  this.name = name;
  this.status = "define";
  this.map_parent = m;
};
Project.prototype.drawProjects = function(dv, addbutton, addinput){
  var that = this;

  // Clean events
  $('.active-project-button').unbind("click");
  $('.delete-project-button').unbind("click");
  $(addbutton).unbind('click');  
  // Print List
  var llista = $("<div id='project-list'>");
  $(dv).html(llista);
  $.each(that.map_parent.projects, function(index,value){
    var row = '<div class="row">' +
              ' <div class="col-s-6">' +
              '   <div class="project-item" id="project-' + value.id + '">' +
                    value.name +
              '   </div>' +
              ' </div>' +
              ' <div class="col-s-6">' +
              '   <button class="active-project-button" id="active-project-' + value.id + '" data-id="' + value.id + '">Active</button>' +
              '   <button class="delete-project-button" id="delete-project-' + value.id + '" data-id="' + value.id + '">Delete</button>' +
              ' </div>' +
              '</div>';
    llista.append(row);
  });
  $(addbutton).on('click', function(e) {
    var name = $(addinput).val();
    if (name != "") {
      var project = new Project(0, name, that.map_parent);
      project.save();
      that.map_parent.projects.push(project);
      project.drawProjects();
    } else {
      that.map_parent.notify("Has de posar un nom de projecte!");
    }
  })
}

Project.prototype.save = function (){
  var that = this;
  strUrl = this.map_parent.serverUrl + "/project";
  console.log('API call: ' + strUrl);
  if (this.id == 0 || this.id == null) {
    $.post( strUrl, JSON.stringify({ "name": this.name, "status": this.status }))
      .done(function( data ) {
        that.map_parent.notify("Updated!");
        that.id = data.id;
      }, "json");
  } else {
    $.put( strUrl+"/"+this.id, JSON.stringify({ "name": this.name, "status": this.status }))
      .done(function( data ) {
        that.map_parent.notify("Updated!");
      }, "json");
  }
};
Project.prototype.delete = function(){
  var that = this;
  strUrl = this.map_parent.serverUrl + "/project";
  console.log('API call: ' + strUrl);
  if (this.id == 0 || this.id == null) {
    console.log("Can not delete project without id.")
  } else {
    $.delete( strUrl+"/"+this.id, JSON.stringify({ "id": this.id }))
      .done(function( data ) {
        that.map_parent.notify("Delete!");
        that.map_parent.projects = $.grep(that.map_parent_project, function(value){
          return value.id != that.id;
        })
      }, "json");
  }
};

module.exports = Project;
