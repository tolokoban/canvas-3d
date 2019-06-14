/** @module main */require( 'main', function(require, module, exports) { var _=function(){var D={"en":{"welcome":"Welcome in the world of"},"fr":{"welcome":"Bienvenue dans le monde de"}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    "use strict";

require("font.josefin");

var $ = require("dom");


module.exports.fillRect = function( ctx ) {
  // #(fillRect)
  var x, y;
  var w = ctx.canvas.width;
  var h = ctx.canvas.height;
  for( y = 0 ; y < h ; y += 25 ) {
    for( x = 0 ; x < w ; x += 25 ) {
      ctx.fillRect( x, y, 20, 20 );
    }
  }
  // #(fillRect)
};

module.exports.fillRectWithFillStyle = function( ctx ) {
  // #(fillRectWithFillStyle)
  ctx.fillStyle = "#f00";
  ctx.fillRect( 10, 10, 260, 120 );
  ctx.fillStyle = "#28af47";
  ctx.fillRect( 20, 20, 260, 120 );
  ctx.fillStyle = "hsl(17,70%,50%)";
  ctx.fillRect( 30, 30, 260, 120 );
  ctx.fillStyle = "#7733fd";
  ctx.fillRect( 40, 40, 260, 120 );
  ctx.fillStyle = "#F39C15";
  ctx.fillRect( 50, 50, 260, 120 );
  // #(fillRectWithFillStyle)
};

module.exports.fillRectWithFillStyleAndAlpha = function( ctx ) {
  // #(fillRectWithFillStyleAndAlpha)
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = "#f00";
  ctx.fillRect( 10, 10, 260, 120 );
  ctx.fillStyle = "#0f0";
  ctx.fillRect( 20, 25, 260, 120 );
  ctx.fillStyle = "#00f";
  ctx.fillRect( 30, 40, 260, 120 );
  ctx.fillStyle = "#73d";
  ctx.fillRect( 40, 55, 260, 120 );
  // #(fillRectWithFillStyleAndAlpha)
};

module.exports.translate = function( ctx ) {
  // #(translate)
  ctx.translate( 100, 50 );
  ctx.fillStyle = "#f00";
  ctx.fillRect( 0, 0, 200, 100 );
  ctx.translate( -60, 20 );  
  ctx.fillStyle = "#00f";
  ctx.fillRect( 0, 0, 200, 100 );
  // #(translate)
};

module.exports.rotate = function( ctx ) {
  // #(rotate)
  ctx.rotate( Math.PI / 6 );
  ctx.fillRect( 50, -25, 200, 100 );
  // #(rotate)
};

module.exports.rotateAndTranslate = function( ctx ) {
  // #(rotateAndTranslate)
  ctx.translate( ctx.canvas.width * 0.5, ctx.canvas.height * 0.5 );
  ctx.rotate( -Math.PI / 13 );
  ctx.translate( -100, -50 );
  ctx.fillRect( 0, 0, 200, 100 );
  // #(rotateAndTranslate)
};

module.exports.saveRestore = function( ctx ) {
  // #(saveRestore)
  ctx.fillStyle = "#0f4";
  for( var a=0 ; a < 25 ; a++ ) {
    ctx.save();
    ctx.fillStyle = "hsl(" + 14.4 * a + " 100% 50%)";
    ctx.translate( ctx.canvas.width * 0.5, ctx.canvas.height * 0.5 );
    ctx.rotate( a * Math.PI * 0.04 );
    ctx.translate( -100, -5 );
    ctx.fillRect( 0, 0, 200, 10 );
    ctx.restore();
  }
  ctx.fillRect( 0, 0, 50, 50 );
  // #(saveRestore)
};

module.exports.saveRestoreFast = function( ctx ) {
  // #(saveRestoreFast)
  var colors = [
    '#0F0', '#1F0', '#2F0', '#3F0', '#4F0', '#5F0', '#6F0', '#7F0',
    '#8F0', '#9F0', '#AF0', '#BF0', '#CF0', '#DF0', '#EF0', '#FF0',
    '#FE0', '#FD0', '#FC0', '#FB0', '#FA0', '#F90', '#F80', '#F70',
    '#F60', '#F50', '#F40', '#F30', '#F20', '#F10', '#F00'
  ];
  var x = ctx.canvas.width / 2;
  var y = ctx.canvas.height / 2;
  var vx1, vy1, vx2, vy2, ang;
  var step = Math.PI / colors.length;
  var halfStep = step / 2;
  var r = 100;
  for( var a=0 ; a < colors.length ; a++ ) {
    ctx.fillStyle = colors[a];
    ang = a * step;
    vx1 = r * Math.cos( ang - halfStep );
    vy1 = r * Math.sin( ang - halfStep );
    vx2 = r * Math.cos( ang + halfStep );
    vy2 = r * Math.sin( ang + halfStep );
    ctx.paintQuad(
      x + vx1, y + vy1,
      x + vx2, y + vy2,
      x - vx1, y - vy1,
      x - vx2, y - vy2
    );
  }
  // #(saveRestoreFast)
};

module.exports.drawImage = function( ctx, images ) {
  // #(drawImage)
  var W = ctx.canvas.width;
  var H = ctx.canvas.height;
  var sprite1 = images.sprite1;

  ctx.drawImage( images.sprite1, 0, 0 );
  ctx.drawImage( images.sprite2, W - 160, 0 );
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.translate( 0.5 * W, 0.5 * H );
  ctx.rotate( Math.PI / 3 );
  ctx.scale( 0.5, 0.5 );
  ctx.translate( -0.5 * sprite1.width, -0.5 * sprite1.height );
  ctx.drawImage( images.sprite1, 0, 0 );
  ctx.restore();
  // #(drawImage)
};

module.exports.drawImageDepth = function( ctx, images ) {
  // #(drawImageDepth)
  var W = ctx.canvas.width;
  var H = ctx.canvas.height;
  var sprite1 = images.sprite1;
  var sprite2 = images.sprite2;

  ctx.depthTest = true;
  ctx.z = 0;
  ctx.drawImage( sprite1, 0, 0 );
  ctx.drawImage( sprite2, W - 160, 0 );
  ctx.globalAlpha = 0.5;
  ctx.z = -0.5;
  ctx.drawImage( sprite1, 100, 0 );
  // #(drawImageDepth)
};

module.exports.drawImageFast = function( ctx, images ) {
  // #(drawImageFast)
  var W = ctx.canvas.width;
  var H = ctx.canvas.height;
  var atlas = images.atlas;

  ctx.drawImage( atlas, 0, 0, 200, 200, W - 200, 0, 200, 200 );
  ctx.drawImage( atlas, 200, 0, 200, 200, 0, 0, 200, 200 );
  ctx.globalAlpha = 0.75;
  ctx.drawImage( atlas, 0, 0, 200, 200, 100, 25, 100, 100 );
  // #(drawImageFast)
};

module.exports.drawImageBad = function( ctx, images ) {
  // #(drawImageBad)
  var W = ctx.canvas.width;
  var H = ctx.canvas.height;
  var sprite1 = images.sprite1;
  var sprite2 = images.sprite2;

  ctx.drawImage( sprite1, 0, 0 );
  ctx.drawImage( sprite2, W - 160, 0 );
  ctx.globalAlpha = 0.5;
  ctx.drawImage( sprite1, 100, 0 );
  // #(drawImageBad)
};

module.exports.fill = function( ctx ) {
  // #(fill)
  ctx.fillStyle = "lime";
  ctx.beginPath();
  ctx.moveTo(50, 100);
  ctx.lineTo(150, 70);
  ctx.lineTo(100, 130);
  ctx.lineTo(30, 50);
  ctx.moveTo(200, 10);
  ctx.lineTo(300, 70);
  ctx.lineTo(300, 100);
  ctx.lineTo(250, 80);
  ctx.lineTo(200, 100);
  ctx.fill();
  // #(fill)
};


  
module.exports._ = _;
/**
 * @module main
 * @see module:$
 * @see module:font.josefin
 * @see module:dom

 */
});