
//=====================
// Project

var Project = function(id, name, m){
  this.id = id;
  this.name = name;
  this.status = "define";
  this.map_parent = m;
};

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
      }, "json");
  }
};

module.exports = Project;
