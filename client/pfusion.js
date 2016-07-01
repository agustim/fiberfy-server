// External modules
var paper = require('paper');

//===
// Print fusions with paper
function Pfusion (cnvs, site) {
  this.canvas = cnvs;
  this.site = site;
  this.fibers = new Array();
  this.title_fontsize = 16;
  this.fontsize = 14;
  this.count_vertical = 15;
  this.incr_vertical = 10;
  this.count_horitzontal = 15;
  this.incr_horitzontal = 10;
}

Pfusion.prototype.draw = function () {
  paper.setup(this.canvas);
  var x = 25,
      y = 40,
      x2 = 130,
      tubes_count = this.site.actualFusionSite.length;

  //Pintem totes les fibres i fusionem a l'hora.
  if (tubes_count > 1)
    split_tubes = Math.floor(tubes_count/2);
    for(var idx=0; idx < split_tubes; idx++){
      tube = this.site.actualFusionSite[idx];
      occupet_space = this.writePipe(x,y,'vertical',tube);
      y = occupet_space[1] + 10;
    }
    x = x2;
    for(var idx = split_tubes; idx < tubes_count; idx++){
      tube = this.site.actualFusionSite[idx];
      occupet_space = this.writePipe(x,y,'horizontal',tube);
      x = occupet_space[0] + 10;
    }
  paper.view.draw();
};
Pfusion.prototype.writeText = function(str, x, y, orientation, color) {
  this.writeTextPaper(str, x, y, orientation, this.fontsize, color);
};
Pfusion.prototype.writeTitle = function(str, x, y, orientation, color) {
  this.writeTextPaper(str, x, y, orientation, this.title_fontsize, color);
};
Pfusion.prototype.writeTextPaper = function(str, x, y, orientation, size, color) {
  if (typeof color == 'undefined') { color = 'red'; }
  var text = new paper.PointText({
      point: new paper.Point(x, y),
      justification: 'left',
      fontSize: size,
      fillColor: color,
      rotation: orientation,
      content: str
    });
  return text;
};
Pfusion.prototype.writeLine = function(x, y, x_longitud, y_longitud, color) {
	var path = new paper.Path();
	path.strokeColor = color;
	var start = new paper.Point(x, y);
	path.moveTo(start);
	path.lineTo(start.add([ x_longitud , y_longitud ]));
  // Aquí podem posar accions a les linies que es dibuixen.
  /*
	if (typeof onclick_event === 'function') {
		path.onClick = function(e) {
			console.log('click');
		};
		path.onMouseMove = function(e){
			this.opacity = 0.2;
		}
		path.onMouseLeave = function(e) {
			this.opacity = 1;
		}
	}
  */
  return path;
};
Pfusion.prototype.writePipe = function(x, y, direction, tube){
  var that = this,
      name = (tube.name != null) ? tube.name + "(" + tube.id + ")" : tube.id;
	if (direction == 'vertical') {
		this.writeTitle(name, x, y, 0);
		y = y + 20;
    try {
      colors = $.parseJSON(tube.colors);
    } catch (e) {
      console.log(e);
      console.log(tube.colors);
    }
		for (var idx_tub in colors){
			tub = colors[idx_tub];
			this.writeText(tub.name, x + 10, y, 0);
			y = y + 10;
			for (var idx_fiber in tub.fibers){
				fiber = tub.fibers[idx_fiber];
				this.writeLine(x+10, y, 80, 0 , fiber.color);
        var fiber_fullname = tube.id + "." + tub.name + "." + fiber.color;
        that.fibers[fiber_fullname] = { x: x+10+80, y: y, color: fiber.color, direction : 'vertical' };
        if (typeof fiber.fusionat != 'undefined'){
          //Mirem si l'altre estrem ja l'hem pintat
          var fusion_fullname = fiber.fusionat;
          if (typeof that.fibers[fusion_fullname] != 'undefined'){
            //Hi ha els dos extrems ja podem fusionar.
            that.writeFusion(that.fibers[fiber_fullname], that.fibers[fusion_fullname]);
          }
        }
				y = y + 3;
			}
			y = y + 15;
		}
	}
	if (direction == 'horizontal') {
		this.writeTitle(name, x, y, 90);
		x = x + 20;
    try {
      colors = $.parseJSON(tube.colors);
    } catch (e) {
      console.log(e);
      console.log(tube.colors);
    }
		for (idx_tub in colors){
			tub = colors[idx_tub];
			//console.log(tub.name);
			this.writeText(tub.name, x + 10, y, 90);
			x = x + 20;
			for (idx_fiber in tub.fibers){
				fiber = tub.fibers[idx_fiber];
				this.writeLine(x+10, y, 0, 80, fiber.color);
        var fiber_fullname = tube.id + "." + tub.name + "." + fiber.color;
        that.fibers[fiber_fullname] = { x: x+10, y: y, color: fiber.color, direction : 'horizontal' };
        if (typeof fiber.fusionat != 'undefined'){
          //Mirem si l'altre estrem ja l'hem pintat
          var fusion_fullname = fiber.fusionat;
          if (typeof that.fibers[fusion_fullname] != 'undefined'){
            //Hi ha els dos extrems ja podem fusionar.
            that.writeFusion(that.fibers[fiber_fullname], that.fibers[fusion_fullname]);
          }
        }
				x = x + 3;
			}
			x = x + 15;
		}
	}
  return [ x , y ];
};
Pfusion.prototype.writeFusion = function(fiberA, fiberB)
{
  // Si x o y son iguals vol dir que estan a la mateixa vertical-horitzontal, cas especial!!!
    var x_long = Math.abs(fiberB.x - fiberA.x),
        y_long = Math.abs(fiberB.y - fiberA.y);

    if (fiberB.direction != fiberA.direction ) {
      if (fiberA.direction == 'vertical' && fiberB.direction == 'horizontal') {
        var fiberC = {x: fiberA.x, y: fiberA.y, direction: fiberA.direction, color:fiberA.color };
        fiberA = {x: fiberB.x, y: fiberB.y, direction: fiberB.direction, color:fiberB.color };
        fiberB = {x: fiberC.x, y: fiberC.y, direction: fiberC.direction, color:fiberC.color };
      }
      this.writeLine(fiberB.x, fiberB.y, x_long, 0, fiberB.color);
      this.writeLine(fiberA.x, fiberA.y, 0, -y_long, fiberA.color);

    } else {

      if (fiberB.direction == 'vertical') {
        this.writeLine(fiberA.x, fiberA.y, 20 + this.count_vertical, 0, fiberA.color );
        this.writeLine(fiberB.x, fiberB.y, 20 + this.count_vertical, 0, fiberB.color );
        this.writeLine(fiberB.x + 20 + this.count_vertical, fiberB.y, 0, y_long/2, fiberB.color);
        this.writeLine(fiberB.x + 20 + this.count_vertical, fiberB.y+y_long/2, 0, y_long/2, fiberA.color);
        this.count_vertical += this.incr_vertical;
      } else {
        this.writeLine(fiberA.x, fiberA.y, 0, - 20 - this.count_horitzontal, fiberA.color );
        this.writeLine(fiberB.x, fiberB.y, 0, - 20 - this.count_horitzontal, fiberB.color );
        this.writeLine(fiberB.x , fiberB.y - 20 - this.count_horitzontal, x_long/2, 0, fiberB.color);
        this.writeLine(fiberB.x  + x_long/2, fiberB.y - 20 - this.count_horitzontal, x_long/2, 0, fiberA.color);
        this.count_horitzontal += this.incr_horitzontal;
      }

    }
};
module.exports = exports = Pfusion;
