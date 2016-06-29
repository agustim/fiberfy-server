//=====================
// box

function Box(id, uuid, name, type, site, m) {
  this.id = id;
  this.uuid = uuid;
  this.name = name;
  this.type = type;
  this.observations = "";
  this.site_parent = site
  this.map_parent = m
  this.type_box = [ "caixa", "poster", "punt final" ];
}

Box.prototype.addHtmlBox = function(){
  var that = this

  var options_type = ""
  for(idx_type in this.type_box){
    tb = this.type_box[idx_type]
    if (this.type == tb) {
      options_type = options_type + '<option value="' + tb + '" selected >' + tb + '</option>'
    } else {
      options_type = options_type + '<option value="' + tb + '" >' + tb + '</option>'
    }
  }

  var html = '<div id="box-' + this.uuid + '" class="row"> \
    <div class="col-s-6">  \
      <label for="box-name-' + this.uuid + '">Nom</label> \
      <input id="box-name-' + this.uuid + '" value="' + this.name + '"/> \
      <label for="box-type-' + this.uuid + '">Tipus</label> \
      <select id="box-type-' + this.uuid + '"> \
      ' + options_type + ' \
      </select> \
    </div> \
    <div class="col-s-5"> \
      <label for="box-observations-' + this.uuid + '">Observations</label> \
      <textarea id="box-observations-' + this.uuid + '">' + this.observations + '</textarea> \
    </div> \
    <div class="col-s-1"> \
      <button id="box-close-' + this.uuid + '" class="rotate">Esborrar</button> \
    </div> \
  </div>';
  $('#box').append(html);
  $('#box-close-' + this.uuid).on('click', function (e){
    that.site_parent.deleteBox(that.uuid);
  })
  $('#box-' + this.uuid + ' input, #box-' + this.uuid + ' textarea, #box-' + this.uuid + ' select').on('change', function(e){
    that.name = $('#box-name-' + that.uuid).val()
    that.type = $('#box-type-' + that.uuid).val()
    that.observations = $('#box-observations-' + that.uuid).val()
    that.save()
  })
}

Box.prototype.save = function (){
  var that = this;
  strUrl = this.map_parent.serverUrl + "/api/v1/box"
  console.log('API call post: ' + strUrl);
  if (this.id == 0) {
    $.post( strUrl, JSON.stringify({ "name": this.name, "uuid": this.uuid, "site_id": this.site_parent.id, "type": this.type, "observations" : this.observations }))
      .done(function( data ) {
        that.map_parent.notify("Updated!");
        myBox = $.parseJSON( data );
        that.id = myBox.id;
      }, "json");
  } else {
    $.put( strUrl+"/"+this.id, JSON.stringify({ "name": this.name, "uuid": this.uuid, "site_id": this.site_parent.id, "type": this.type, "observations" : this.observations }))
      .done(function( data ) {
        that.map_parent.notify("Updated!");
      }, "json");
  }
}

Box.prototype.delete = function (id){
  var that = this;
  strUrl = this.map_parent.serverUrl + "/api/v1/box/"+id
  console.log('API call delete: ' + strUrl);
  $.delete( strUrl )
    .done(function( data ) {
      that.map_parent.notify("Deleted!");
      $('#box-'+ that.uuid).remove()
    });
}
module.exports = exports = Box;
