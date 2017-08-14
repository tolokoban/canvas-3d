"use strict";

var $ = require("dom");
var DB = require("tfw.data-binding");
var Button = require("wdg.button");
var Canvas3D = require("canvas-3d");


/**
 * @class Comparator
 *
 * @param {boolean} opts.visible - Set the visiblity of the component.
 *
 * @example
 * var Comparator = require("comparator");
 * var instance = new Comparator({visible: false});
 */
var Comparator = function(opts) {
  var that = this;

  var canvas1 = $.tag( "canvas", "thm-ele2", {
    width: 340, height: 200
  });
  var canvas2 = $.tag( "canvas", "thm-ele2", {
    width: 340, height: 200
  });
  var btnCompare = new Button({
    flat: true,
    wide: true,
    icon: "gear",
    text: "Start a speed test"
  });
  var divResult = $.div();
  var elem = $.elem( this, 'div', 'comparator', [
    $.div( "flex", [canvas1, canvas2] ),
    $.div( "flex", [btnCompare, divResult] ),
  ] );

  DB.prop( this, 'slot' )(function(slot) {
    if( typeof slot === "string" ) {
      slot = APP[slot];
    }
    if( typeof slot === "function" ) {
      window.setTimeout(function() {
        var ctx1 = canvas1.getContext("2d");
        try {
          slot( ctx1 );
        } catch( ex ) {
          console.error( Error( ex ) );
        }
        var ctx2 = new Canvas3D( canvas2 );
        try {
          slot( ctx2 );
        } catch( ex ) {
          console.error( Error( ex ) );
        }
      });
    }
  });

  btnCompare.on(function() {
    var slot = that.slot;
    if( typeof slot === "string" ) {
      slot = APP[slot];
    }

    var c1 = document.createElement("canvas");
    c1.setAttribute("width", 340);
    c1.setAttribute("height", 200);
    var c2 = document.createElement("canvas");
    c2.setAttribute("width", 340);
    c2.setAttribute("height", 200);
    var ctx1 = c1.getContext("2d");
    var ctx2 = c2.getContext("2d");
    var time1;
    var time2;
    var LOOPS = 20000;
    var loop;

    divResult.textContent = "---";
    btnCompare.enabled = false;

    window.setTimeout(function() {
      loop = LOOPS;
      time1 = window.performance.now();
      while( loop --> 0 ) {
        slot( ctx1 );
      }
      time1 = window.performance.now() - time1;

      loop = LOOPS;
      time2 = window.performance.now();
      while( loop --> 0 ) {
        slot( ctx2 );
      }
      time2 = window.performance.now() - time2;

      var result = Math.floor( 0.5 + 100 * (time2 / time1) );
      divResult.textContent = result + " %";
      btnCompare.enabled = true;
    }, 350);
  });

  opts = DB.extend({
    slot: null
  }, opts, this);
};


module.exports = Comparator;
