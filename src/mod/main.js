"use strict";

require("font.josefin");

var $ = require("dom");


module.exports.fillRect = function( ctx ) {
  // #(fillRect)
  ctx.fillRect( 10, 10, 200, 100 );
  // #(fillRect)
};

module.exports.fillRectWithFillStyle = function( ctx ) {
  // #(fillRectWithFillStyle)
  ctx.fillStyle = "#f00";
  ctx.fillRect( 10, 10, 260, 120 );
  ctx.fillStyle = "#28af47";
  ctx.fillRect( 20, 20, 260, 120 );
  ctx.fillStyle = "#00f";
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
