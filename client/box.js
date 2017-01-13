//=====================
// box

function Box(id, uuid, name, type, site, m) {
  this.id = id;
  this.uuid = uuid;
  this.name = name;
  this.inputFO = 0;
  this.outputFO = 0;
  this.type = type;
  this.needSave = false;
  this.observations = "";
  this.site_parent = site;
  this.map_parent = m;
}

Box.prototype.addHtmlBox = function(){
  var that = this;

  var options_type = "";
  for(idx_type in this.map_parent.type_box){
    tb = this.map_parent.type_box[idx_type];
    if (this.type == tb.name) {
      options_type = options_type + '<option value="' + tb.name + '" selected data-in ="' + tb.in + '" data-out="' + tb.out + '">' + tb.name + '</option>';
    } else {
      options_type = options_type + '<option value="' + tb.name + '" data-in ="' + tb.in + '" data-out="' + tb.out + '">' + tb.name + '</option>';
    }
  }

  var html = '<div id="box-' + this.uuid + '"> \
   <div class="row"> \
    <div class="col-s-6">  \
      <label for="box-name-' + this.uuid + '">Nom</label> \
      <input id="box-name-' + this.uuid + '" value="' + this.name + '"/> \
      <label for="box-type-' + this.uuid + '">Tipus</label> \
      <select id="box-type-' + this.uuid + '"> \
        ' + options_type + ' \
      </select> \
      <label for="box-inputFO-' + this.uuid + '">Input</label> \
      <input id="box-inputFO-' + this.uuid + '" value="' + this.inputFO + '"/> \
      <label for="box-outputFO-' + this.uuid + '">Output</label> \
      <input id="box-outputFO-' + this.uuid + '" value="' + this.outputFO + '"/> \
    </div> \
    <div class="col-s-5"> \
      <label for="box-observations-' + this.uuid + '">Observations</label> \
      <textarea id="box-observations-' + this.uuid + '">' + this.observations + '</textarea> \
    </div> \
   </div> \
   <div class="row"> \
   <div class="col-s-1"> \
     <button id="box-update-' + this.uuid + '">Update</button> \
   </div> \
    <div class="col-s-1"> \
      <button id="box-close-' + this.uuid + '">Esborrar</button> \
    </div> \
  </div>';
  $('.box').append(html);
  $('#box-close-' + this.uuid).on('click', function (e){
    that.site_parent.deleteBox(that.uuid);
  });
  $('#box-' + this.uuid + ' input, #box-' + this.uuid + ' textarea, #box-' + this.uuid + ' select').on('change', function(e){
    var field_id = new String(e.target.id);
    if (field_id.indexOf('box-type-') == 0) {
      that.inputFO = $(this).find(':selected').data('in');
      $('#box-inputFO-' + that.uuid).val(that.inputFO);
      that.outputFO = $(this).find(':selected').data('out');
      $('#box-outputFO-' + that.uuid).val(that.outputFO);
    }
  });
  $('#box-update-' + this.uuid).on('click', function(e){
    that.name = $('#box-name-' + that.uuid).val();
    that.type = $('#box-type-' + that.uuid).val();
    that.inputFO = $('#box-inputFO-' + that.uuid).val();
    that.outputFO = $('#box-outputFO-' + that.uuid).val();
    that.observations = $('#box-observations-' + that.uuid).val();
    that.save();
  });
};

Box.prototype.save = function (){
  var that = this;
  strUrl = this.map_parent.serverUrl + "/box";
  console.log('API call post: ' + strUrl);
  if (this.id == 0) {
    $.post( strUrl, JSON.stringify({ "name": this.name, "uuid": this.uuid, "site": this.site_parent.id,
          "type": this.type, "inputFO": parseInt(this.inputFO), "outputFO": parseInt(this.outputFO), "observations" : this.observations,
          "project" : this.map_parent.active_project.id }))
      .done(function( data ) {
        that.map_parent.notify("Updated!");
        that.id = data.id;
      }, "json")
      .fail(function( data ) {
        $('#box-'+ that.uuid).remove();
        alert("There was a problem. Please, try again.");
      });
  } else {
    $.put( strUrl+"/"+this.id, JSON.stringify({ "name": this.name, "uuid": this.uuid, "site": this.site_parent.id,
          "type": this.type, "inputFO": this.inputFO, "outputFO": this.outputFO, "observations" : this.observations,
          "project" : this.map_parent.active_project.id }))
      .done(function( data ) {
        that.map_parent.notify("Updated!");
      }, "json")
      .fail(function( data ) {
        $('#box-'+ that.uuid).remove();
        alert("There was a problem. Please, try again.");
      });
  }
};

Box.prototype.delete = function (id){
  var that = this;
  strUrl = this.map_parent.serverUrl + "/box/"+id;
  console.log('API call delete: ' + strUrl);
  $.delete( strUrl )
    .done(function( data ) {
      that.map_parent.notify("Deleted!");
      $('#box-'+ that.uuid).remove();
    });
};
module.exports = exports = Box;
