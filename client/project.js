
//=====================
// Project

var Project = function(id, name, username, m){
  this.id = id;
  this.name = name;
  this.username = username;
  this.map_parent = m;
};

Project.prototype.load = function (){

};
module.exports = Project;
