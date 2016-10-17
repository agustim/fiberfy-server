

function Llegenda (d, width, height, m, cb) {
  var that = this;
  this.line = 1;
  this.line_distance = 30;
  this.top_margin = 20;
  this.color_default = 'black'
  this.cnvs = d.createElement("canvas");
  this.cnvs.width = width;
  this.cnvs.height = height;
  this.cb = cb;

  this.ctx = this.cnvs.getContext('2d');
  //this.ctx.fillStyle = 'rgba(255,255,255,255)';
  this.ctx.fillStyle = 'white';
  this.ctx.fillRect(0, 0, width, height);
  this.ctx.font = "20px Verdana";
  this.loadImgAsync = 0;
  this.icons = {};
  //Load
  for(idx in m.type_site){
    this.loadImgAsync++;
    baseimage = new Image();
    baseimage.iconName = m.type_site[idx].toLowerCase();;
    baseimage.onload = function() {
      that.icons[ this.iconName ] = this;
      that.loadImgAsync--;
      if (that.loadImgAsync == 0) {
        that.cb();
      }
    }
    baseimage.src = L.Icon.Default.imagePath +  '/' + baseimage.iconName + '.png';
  }
}

Llegenda.prototype.test = function () {

  this.writeIconLine("cambra","Legend 1");
  this.writeLine("Legend 2");
  this.writeIconLine("arqueta","Legend 3");
  this.writeLine("Legend 4");

}

Llegenda.prototype.writeLine = function(text, color) {
  if (!color) {
    this.ctx.fillStyle = this.color_default;
  } else {
    this.ctx.fillStyle = color;
  }
  this.ctx.fillText(text, 10, this.top_margin + (this.line * this.line_distance) );
  this.line++;
}

Llegenda.prototype.writeIconLine = function(icon, text, color) {
  if (!color) {
    this.ctx.fillStyle = this.color_default;
  } else {
    this.ctx.fillStyle = color;
  }
  this.ctx.drawImage(this.icons[icon], 10, this.top_margin + (this.line * this.line_distance) );
  this.ctx.fillText(text, 50, this.top_margin + (this.line * this.line_distance) );
  this.line++;
}

Llegenda.prototype.toPNG = function() {
  return (this.cnvs.toDataURL('image/png'));
}

module.exports = exports = Llegenda;
