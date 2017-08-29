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